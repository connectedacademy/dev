<template lang="pug">

.profile-panel(:class="{ limited: limitHeight, collapsed: false, expanded: expandedView }")

  profile-panel-header(:label="`${panel.label} (${moderationItems.messages.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh :can-expand="canExpand")
  
  .profile-panel--content.no-padding
    //- .no-results() {{ $t('common.no_results') }}
    //- pre {{ moderationItems.messages }}
    message(v-for="(message, index) in moderationItems.messages" :key="index" :user="user" :message="message" :truncate="false" :can-jump="false" :moderate="true" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'
import API from '@/api'

import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import StudentTile from '@/components/profile/tiles/StudentTile'

import Message from '@/components/live/Message'

export default {
  name: 'moderation',
  props: ['panel', 'limitHeight', 'canExpand', 'expandedView'],
  components: {
    ProfilePanelHeader,
    StudentTile,
    Message
  },
  mounted() {
    this.loadData()
    Events.$on('profileClassUpdated', () => {
      this.loadData()
    })
  },
  data() {
    return {
      moderationItems: {
        messages: [],
        discussion: [],
        submissions: []
      }
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug'])
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    loadData() {
      API.moderation.getPending(
        (response) => {
          Vue.$log.info(response)
          this.moderationItems = response
          Events.$emit('redrawMasonry')
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve messages')
        }
      )
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'
  
</style>