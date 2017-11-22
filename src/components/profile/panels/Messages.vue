<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight }")

  profile-panel-header(v-bind:label="`${panel.label} (${messages.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh v-bind:can-expand="canExpand")
  
  //- .filter-search(v-if="expandedView")
    input(v-model="filterTerm" placeholder="Filter Results...")

  .profile-panel--content.no-padding
    .no-results(v-if="messages.length === 0") {{ $t('common.no_results') }}
    //- pre(v-for="(message, index) in filteredMessages") {{ message }}
    message(v-for="(message, index) in filteredMessages" v-bind:key="index" v-bind:message="message" v-bind:truncate="false" v-bind:can-jump="true" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import API from '@/api'
import _filter from 'lodash/filter'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import StudentTile from '@/components/profile/tiles/StudentTile'

import Message from '@/components/conversation/Message'

export default {
  name: 'messages',
  props: ['panel', 'limitHeight', 'canExpand', 'expandedView'],
  components: {
    ProfilePanelHeader,
    StudentTile,
    Message
  },
  mounted() {
    if (this.expandedView) { this.loadData() }
    this.autoUpdateInterval = setInterval(() => { this.loadData() }, 20000)
    EventBus.$on('profileClassUpdated', () => {
      this.loadData()
    })
  },
  beforeDestroy() {
    if (this.autoUpdateInterval) {
      clearInterval(this.autoUpdateInterval)
    }
  },
  data() {
    return {
      messages: [],
      filterTerm: '',
      autoUpdateInterval: undefined
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug']),
    filteredMessages() {
      return this.messages
      // _filter(this.messages, (message) => {
      //   return true
      //   // return message.account.profile === this.filterTerm
      // })
    }
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    loadData() {
      let request = {
        theClass: (typeof this.profileClassSlug !== 'undefined') ? this.profileClassSlug : undefined,
        userId: (this.panel.role === 'user') ? this.user.id : undefined,
        teacher: (this.panel.role === 'teacher') ? true : undefined
      }

      API.profile.getMessages(
        request,
        (response) => {
          this.messages = response.data
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve messages')
          this.messages = []
        }
      )
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'
  
</style>