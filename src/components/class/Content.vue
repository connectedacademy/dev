<template lang="pug">
.content-wrapper
  .content(v-for="(content, index) in classContent" v-bind:key="index" v-bind:title="content.type" v-bind:is="contentComponent(content.type)" v-bind:content="content")
  .clearfix
</template>

<script>
import { mapGetters } from 'vuex'
import _filter from 'lodash/filter'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import DeepDive from '@/components/tiles/DeepDive'
import FourCornersBanner from '@/components/tiles/FourCornersBanner'
import Homework from '@/components/tiles/Homework'
import LiveClass from '@/components/tiles/LiveClass'
import NextClass from '@/components/tiles/NextClass'
import Survey from '@/components/tiles/Survey'

export default {
  name: 'class-content',
  mixins: [ PageStyle ],
  components: {
    DeepDive,
    FourCornersBanner,
    Homework,
    LiveClass,
    NextClass,
    Survey
  },
  data() {
    return {
      pageStyle: { visible: true, minimized: false },
      navTitle: 'Connected Academy - Content'
    }
  },
  computed: {
    ...mapGetters(['classContent'])
  },
  methods: {
    contentComponent (type) {
      switch (type) {
        case 'fourcorners':
          return 'FourCornersBanner'

        case 'nextclass':
          return 'NextClass'

        case 'liveclass':
          return 'LiveClass'

        case 'homework':
          return 'Homework'

        default:
          return 'DeepDive'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

</style>
