<template lang="pug">

.schedule-page(name="schedule-page")

  .col#col-main
    .main-container(v-if="course")
      narrow-page-header(:title="course.title" subtitle="Dive in to incredible live classes")
      .content-block.header-block.unpadded-block.white-block
        ul(name="class-list")
          router-link(tag="li" v-for="(theClass, index) in course.classes" :key="index" :to="canView(theClass) ? { name: 'content', params: { classSlug: theClass.slug } } : {}" :class="{ released: canView(theClass), 'has-release': theClass.releaseAt }")
            .state-tags
              .state-tag.active(v-if="theClass.active") Live
              .state-tag(:class="{ released: isReleased(theClass) }" :title="`${isReleased(theClass) ? 'Released on' : 'Will be released'} - ${prettyDate(theClass.date)}`") {{ isReleased(theClass) ? 'Open' : 'Closed' }}
              .clearfix
            h3 {{ (index + 1) + ': ' + theClass.title }}
            h5 {{ (!theClass.description) ? 'No description provided was for this class' : theClass.description }}
            .clearfix

</template>

<script>
import Moment from 'moment-mini'

import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import _get from 'lodash/get'

// Mixins
import PageStyle from '@/mixins/PageStyle'

export default {
  name: 'schedule',
  mixins: [ PageStyle ],
  computed: {
    ...mapGetters(['course', 'user'])
  },
  mounted() {
    Events.$on('contentUpdated', (type) => {
      if (['schedule'].indexOf(type) !== -1) {
        this.$store.dispatch('getCourse')
      }
    })
  },
  beforeDestroy() {
    Events.$off('contentUpdated')
  },
  methods: {
    prettyDate(date) {
      return Moment(date).format('DD MMM YYYY')
    },
    isReleased(theClass) {
      return theClass.released
    },
    canView(theClass) {
      // Can view if class is released or user is admin
      return this.isReleased(theClass) || (this.user && this.user.roles.admin)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.schedule-page
  .main-container
    h1
      reset()
      margin-bottom 20px
    ul
      cleanlist()
      overflow hidden
      @media(max-width: 800px)
        radius(0)
      li
        cleanlist()
        box-shadow()
        border-box()
        animate()
        background-color white
        min-height 92px
        padding 30px
        position relative
        &:not(:last-child)
          border-bottom $color-border 1px solid
        &.has-release
          padding-left 140px
        &.released
          background-color white
          &:hover
            cursor pointer
            background-color $color-lightest-grey
        h3
          reset()
          font-size 1.3em
        h5
          reset()
          color $color-text-grey
          font-weight normal
          font-size 1.1em
        p
          reset()
          font-size 1em
        .state-tags
          position absolute
          top 15px
          right 15px
          .state-tag
            animate()
            radius(12px)
            box-sizing()
            background-color $color-border
            color $color-text-grey
            display inline-block
            font-size 0.8em
            height 24px
            line-height 24px
            margin 5px 5px 5px 0
            min-width 24px
            padding 0 10px
            &.active
              background-color $color-info
              color white
            &.released
              background-color $color-success
              color white
            @media(max-width: 568px)
              radius(3px)
              content ''
              height 6px
              overflow hidden
              width 24px
              &.active
                color $color-info
              &.released
                color $color-success
        .calendar-tile
          box-shadow()
          radius($corner-radius)
          background-color white
          border $color-border 1px solid
          overflow hidden
          position absolute
          left 30px
          top 30px
          text-align center
          width 80px
          .day-label
            color $color-text-darkest-grey
            font-size 1.8em
            font-weight bold
            line-height 50px
          .month-label
            background-color #BB0028
            color white
            font-size .8em
            font-weight bold
            line-height 20px
</style>
