<template lang="pug">
.class-content  
  .column.column-left
    //- h1 left
  .column.column-center
    narrow-page-header(v-if="currentClass.loading" title="" v-bind:subtitle="course.title" route="schedule")
    narrow-page-header(v-else v-bind:title="currentClass.title" v-bind:subtitle="course.title")
    .content-wrapper(v-for="(content, index) in primaryContent" v-bind:key="index" v-bind:title="content.content_type")
      .content(v-bind:is="contentComponent(content.content_type)" v-bind:content="content")
  .column.column-right
    .content-wrapper
      .content-item.liveclass-item(v-for="(content, index) in secondaryContent" v-bind:key="index")
        h3
          i.fas.fa-headphones
          | {{ content.title }}
        p {{ content.description }}
        router-link.pure-button.pure-button-info.full-width.no-margin(v-if="content.content_type === 'class'" v-bind:to="{ name: 'class', params: { classSlug: currentClass.slug } }") Join conversation
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
import Homework from '@/components/conversation/Homework'
import FourCornersBanner from '@/components/class/FourCornersBanner'
// import NextClass from '@/components/conversation/NextClass'
// import Survey from '@/components/conversation/Survey'
// import FutureContent from '@/components/conversation/FutureContent'

export default {
  name: 'content',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    DeepDive,
    Homework,
    FourCornersBanner,
    // NextClass,
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
    ...mapGetters(['course', 'currentClass']),
    primaryContent () {
      return _filter(this.currentClass.content, (content) => {
        const types = ['intro', 'pre', 'postclass', 'fourcorners']
        return types.indexOf(content.content_type) !==  -1
      })
    },
    secondaryContent () {
      return _filter(this.currentClass.content, (content) => {
        const types = ['class', 'homework', 'nextclass']
        return types.indexOf(content.content_type) !==  -1
      })
    }
  },
  methods: {
    contentComponent (type) {
      switch (type) {
        case 'fourcorners':
          return 'FourCornersBanner'
      
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
  max-width 1340px
  padding 10px
  padding-top $navigation-height
  .column
    box-sizing()
    float left
    min-height 10px
    h1
      color white
    &.column-center
      padding 20px 10px 0 10px
      width 60%
    &.column-right
      padding 82px 10px 10px 10px
    &.column-left, &.column-right
      width 20%

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

  // @media(max-width: 1340px)
  //   .column
  //     &.column-center
  //       width 70%
  //     &.column-left
  //       display none
  //     &.column-right
  //       width 30%

  @media(max-width: 1340px)
    .column
      &.column-center, &.column-right
        float none
        // padding-left 0
        // padding-right 0
        margin 0 auto
        max-width 790px
        width 100% 
      &.column-right
        padding-top 0
</style>
