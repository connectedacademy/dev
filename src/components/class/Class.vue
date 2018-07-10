<template lang="pug">
.class-content
  .column.column-left
  
  .column.column-center
    narrow-page-header(v-bind:title="currentClass.title" v-bind:subtitle="course.title")
    transition(name="fade" appear mode="out-in")
      router-view
  
  .column.column-right
    .content-wrapper
      live-class(v-if="liveclass" v-bind:content="liveclass" independent)
  .clearfix
</template>

<script>
import { mapGetters } from 'vuex'
import _filter from 'lodash/filter'
import _find from 'lodash/find'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import NarrowPageHeader from '@/components/NarrowPageHeader'
import LiveClass from '@/components/tiles/LiveClass'

export default {
  name: 'class-content',
  mixins: [ PageStyle ],
  components: {
    NarrowPageHeader,
    LiveClass
  },
  data() {
    return {
      pageStyle: { visible: true, minimized: false },
      navTitle: 'Connected Academy - Content'
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass']),
    liveclass() {
      return _find(this.currentClass.content, { type: 'class' })
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
      padding 0 0 220px 0
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
      &.column-left, &.column-right
        display none
</style>
