<template lang="pug">

.profile-panel

  profile-panel-header(v-bind:label="panel.label" v-on:refresh="loadData" v-on:expand="expand" can-refresh v-bind:can-expand="canExpand")

  .profile-panel--content

    .pure-button.pure-button-subtle(v-for="(content, index) in contentSlugs" @click="contentSlug = content.slug" v-bind:class="{ 'active': (contentSlug === content.slug) }") {{ content.title }}

    .no-results(v-if="submissions.length === 0") {{ $t('common.no_results') }}

    .submission(v-for="(submission, index) in submissions" v-if="(limitHeight && (index < 3)) || !limitHeight")
      img(v-if="expandedView" v-bind:src="submission.thumbnail" width="100%")
      .submission--thumbnail(v-else v-bind:style="{ 'background-image': `url(${submission.thumbnail})` }")
      
      a(v-bind:href="submission.original" target="_blank")
      p {{ submission.user.name }} ({{ submission.user.account }})
      p Submitted {{ timeStamp(submission.createdAt) }}

</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import API from '@/api'
import filter from 'lodash/filter'

import Moment from 'moment-mini'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import ContentFilter from '@/components/profile/ContentFilter'

import 'vue-awesome/icons/refresh'

export default {
  name: 'submissions',
  props: ['classSlug', 'limitHeight', 'canExpand', 'panel', 'expandedView'],
  components: {
    ProfilePanelHeader,
    ContentFilter,
  },
  mounted() {
    if (this.expandedView) { this.loadData() }
    EventBus.$on('profileClassUpdated', () => {
      this.loadData()
    })
  },
  data() {
    return {
      submissions: [],
      contentSlug: 'homework', //TODO make dynamic
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClass', 'profileClassSlug']),
    contentSlugs() {
      if (typeof this.profileClassSlug === 'undefined') return []
      return filter(this.profileClass.content, (obj) => {
        return obj.homework
      })
    },
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    timeStamp(timestamp) {
      // return Moment(timestamp).format('LTS - ddd M YYYY')
      return Moment(timestamp).fromNow()
    },
    loadData() {

      this.submissions = []

      API[this.panel.role].getHomework(
        this.profileClassSlug,
        (response) => {
          this.submissions = response
          EventBus.$emit('redrawMasonry')
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve student list')
          this.submissions = []
        },
      )
    },
  },
}

</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/profile'

.profile-panel

  .profile-panel--content
    padding 15px

    .pure-button.pure-button-subtle
      display block
      margin-bottom 10px
      &.active
        background $color-border
        color $color-text-dark-grey

    .submission
      color $color-text-light-grey
      margin-bottom 20px
      width 100%
      &:last-child
        margin-bottom 0
      .submission--thumbnail
        background-image()
        height 160px
      p
        reset()
        color $color-text-dark-grey
        font-size .9em
        margin-top 5px
        &:last-child
          color $color-text-light-grey
          margin-top 0

      a
        display block
        text-decoration none
        img
          display block
          width 100%

</style>
