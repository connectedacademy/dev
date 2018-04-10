<template lang="pug">
.content-wrapper
  .content(v-for="(content, index) in primaryContent" v-bind:key="index" v-bind:title="content.content_type" v-bind:is="contentComponent(content.content_type)" v-bind:content="content")
  .clearfix
</template>

<script>
import { mapGetters } from 'vuex'
import _filter from 'lodash/filter'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import DeepDive from '@/components/class/DeepDive'
import Homework from '@/components/class/Homework'
import FourCornersBanner from '@/components/class/FourCornersBanner'
import NextClass from '@/components/class/NextClass'
import Survey from '@/components/class/Survey'
// import FutureContent from '@/components/live/FutureContent'

export default {
  name: 'class-content',
  mixins: [ PageStyle ],
  components: {
    DeepDive,
    Homework,
    FourCornersBanner,
    NextClass,
    Survey,
    // FutureContent
  },
  data() {
    return {
      pageStyle: { visible: true, minimized: false },
      navTitle: 'Connected Academy - Content'
    }
  },
  computed: {
    ...mapGetters(['primaryContent'])
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
