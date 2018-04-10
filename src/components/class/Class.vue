<template lang="pug">
.class-content
  .column.column-left
  
  .column.column-center
    narrow-page-header(v-bind:title="currentClass.title" v-bind:subtitle="course.title")
    transition(name="fade" appear mode="out-in")
      router-view
  
  .column.column-right
    .content-wrapper
      transition(name="fade" appear mode="out-in")
        .content-item.liveclass-item(v-for="(content, index) in secondaryContent" v-bind:key="index" v-if="$route.name !== 'live' || content.content_type !== 'class'")
          h3
            i.fas.fa-headphones
            | {{ content.title }}
          p Join the live discussion right here on Connected Academy via Twitter
          router-link.pure-button.pure-button-info.full-width.no-margin(v-if="content.content_type === 'class'" v-bind:to="{ name: 'live' }") Join class
  .clearfix
</template>

<script>
import { mapGetters } from 'vuex'
import _filter from 'lodash/filter'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'

import DeepDive from '@/components/class/DeepDive'
import Homework from '@/components/live/Homework'
import FourCornersBanner from '@/components/class/FourCornersBanner'
import NextClass from '@/components/class/NextClass'
// import Survey from '@/components/live/Survey'
// import FutureContent from '@/components/live/FutureContent'

export default {
  name: 'class-content',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    DeepDive,
    Homework,
    FourCornersBanner,
    NextClass,
    // Survey,
    // FutureContent
  },
  data() {
    return {
      pageStyle: { visible: true, minimized: false },
      navTitle: 'Connected Academy - Content'
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass', 'secondaryContent'])
  },
  methods: {
    contentComponent (type) {
      switch (type) {
        case 'fourcorners':
          return 'FourCornersBanner'

        case 'nextclass':
          return 'NextClass'
      
        default:
          return 'DeepDive'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.class-content
  margin 0 auto
  max-width 1300px
  padding-top $navigation-height
  .column
    box-sizing()
    float left
    min-height 100px
    h1
      color white
    &.column-center
      padding 0 0 100px 0
      width 60%
    &.column-right
      padding $navigation-height 20px 100px 20px
    &.column-left, &.column-right
      width 20%

  @media(max-width: 1340px)
    .column
      float none
      margin 0 auto
      max-width 780px !important
      width calc(100% - 20px) !important
      &.column-center
        padding-bottom 0
      &.column-left
        display none
      &.column-right
        padding 0 0 100px 0


.content-wrapper
  .content-item
    radius(10px)
    background-color white
    margin 20px 0 0 0
    padding 20px
    position relative
    &.liveclass-item
      h3
        reset()
        svg
          margin-right 6px
      p
        reset()
        margin 10px 0
</style>
