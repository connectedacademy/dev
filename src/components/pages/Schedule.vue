<template lang="pug">

.schedule-page(name="schedule-page")
  .col#col-main
    .main-container
      narrow-page-header(title="Schedule" subtitle="Browse upcoming classes" route="schedule")
      .content-block.header-block.unpadded-block.white-block
        ul
          router-link(tag="li" v-for="(theClass, index) in course.classes" v-bind:key="index" v-bind:to="{ name: 'class', params: { classSlug: theClass.slug } }")
            .calendar-tile
              .day-label
                | {{ releaseDay(theClass) }}
              .month-label
                | {{ releaseMonth(theClass) }}
            .state-tags
              .state-tag.active(v-if="isActive(theClass)")
                span Active
              .state-tag.released(v-if="isReleased(theClass)")
                span Released
              .state-tag(v-if="!isReleased(theClass)")
                span Not Released
              .clearfix
            h3 {{ `${theClass.title} (${(index + 1)}/${course.classes.length})` }}
            h5 {{ (!theClass.description) ? 'No description provided was for this class' : theClass.description }}
            .clearfix

</template>

<script>
import Moment from 'moment-mini'

import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'

export default {
  name: 'schedule',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course'])
  },
  methods: {
    isActive(theClass) {
      return (theClass.status === 'CURRENT')
    },
    isReleased(theClass) {
      return Moment().isAfter(Moment(theClass.release_at)) || (theClass.status === 'RELEASED')
    },
    releaseDay(theClass) {
      return Moment(theClass.release_at).format('D')
    },
    releaseMonth(theClass) {
      return Moment(theClass.release_at).format('MMM')
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
        border-bottom $color-border 1px solid
        min-height 92px
        padding 30px
        padding-left 160px
        position relative
        &:hover
          cursor pointer
          background-color $color-lightest-grey
        &:last-child
          border-bottom none
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
            transition(height 0.3s ease)
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
            span
              transition(opacity 0.2s ease)
              opacity 1
            &.active
              background-color $color-info
              color white
            &.released
              background-color $color-success
              color white
            @media(max-width: 568px)
              radius(3px)
              height 6px
              width 24px
              span
                opacity 0
        .calendar-tile
          box-shadow()
          radius(10px)
          background-color white
          border $color-border 1px solid
          overflow hidden
          position absolute
          left 30px
          top 30px
          text-align center
          width 100px
          .day-label
            color $color-text-darkest-grey
            font-size 2em
            font-weight bold
            line-height 60px
          .month-label
            background-color #BB0028
            color white
            font-weight bold
            line-height 30px
</style>
