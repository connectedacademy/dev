<template lang="pug">

.profile-panel(:class="{ limited: limitHeight, collapsed: false, expanded: expandedView }")

  profile-panel-header(:label="`${panel.label} (${messages.length === 100 ? '100+' : messages.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh :can-expand="canExpand")
  
  .profile-panel--content.no-padding
    .no-results(v-if="messages.length === 0") {{ $t('common.no_results') }}
    message(v-for="(message, index) in filteredMessages" :key="index" :user="user" :message="message" :truncate="false" :can-jump="true" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import API from '@/api'

import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import StudentTile from '@/components/profile/tiles/StudentTile'

import Message from '@/components/live/Message'

export default {
  name: 'messages',
  props: ['panel', 'limitHeight', 'canExpand', 'expandedView'],
  components: {
    ProfilePanelHeader,
    StudentTile,
    Message
  },
  mounted() {
    this.loadData()
    EventBus.$on('profileClassUpdated', () => {
      this.loadData()
    })

    EventBus.$on('message', (message) => {
      Vue.$log.info('Loading..')
      this.loadData()
    })
  },
  data() {
    return {
      messages: [],
      filterTerm: ''
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug']),
    filteredMessages() {
      return _orderBy(this.messages, ['created'], ['desc'])
    }
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    loadData() {
      API[this.panel.role].getMessages(
        this.profileClassSlug,
        (response) => {
          this.messages = response
          EventBus.$emit('redrawMasonry')
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
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