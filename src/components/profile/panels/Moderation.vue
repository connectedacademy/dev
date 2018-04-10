<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight, collapsed: false, expanded: expandedView }")

  profile-panel-header(v-bind:label="`${panel.label} (${moderationItems.messages.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh v-bind:can-expand="canExpand")
  
  .profile-panel--content.no-padding
    //- .no-results() {{ $t('common.no_results') }}
    //- pre {{ moderationItems.messages }}
    message(v-for="(message, index) in moderationItems.messages" v-bind:key="index" v-bind:message="message" v-bind:truncate="false" v-bind:can-jump="false" v-bind:moderate="true" v-if="(limitHeight && (index < 4)) || !limitHeight")

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
  name: 'moderation',
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
          EventBus.$emit('redrawMasonry')
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