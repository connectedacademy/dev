<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight }")

  profile-panel-header(v-bind:label="`${panel.label} (${students.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh  can-expand)

  .profile-panel--content.no-padding
    .no-results(v-if="students.length === 0") {{ $t('common.no_results') }}
    student-tile(v-for="(student, index) in students" v-bind:key="index" v-bind:student="student" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import Vue from 'vue'
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import StudentTile from '@/components/profile/tiles/StudentTile'

export default {
  name: 'students',
  props: ['classSlug', 'limitHeight', 'panel', 'expandedView'],
  components: {
    ProfilePanelHeader,
    StudentTile
  },
  mounted() {
    if (this.expandedView) { this.loadData() }
    EventBus.$on('profileClassUpdated', () => {
      this.loadData()
    })

    // New student added, push to list
    Vue.io.socket.on('classroom', (obj) => {
      Vue.$log.info('socket - classroom')
      Vue.$log.info(obj.data)
      // if (obj.data.msgtype === 'classroom') {
        //   Vue.$log.info('"classroom" socket')
      // }
    })
  },
  data() {
    return {
      students: []
    }
  },
  computed: {
    ...mapGetters(['profileClass', 'profileClassSlug']),
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    loadData() {
      this.students = []
      
      API[this.panel.role].getStudents(
        this.profileClassSlug,
        (response) => {
          this.students = response
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve student list')
          this.students = []
        }
      )
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

.profile-panel--content
  ul
    cleanlist()
    li
      cleanlist()
      border-bottom $color-lighter-grey 1px solid
      padding 15px 0 15px 60px
      position relative

</style>

