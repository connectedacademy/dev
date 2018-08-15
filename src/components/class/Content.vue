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
import Content from '@/components/tiles/Content'
import FourCornersBanner from '@/components/tiles/FourCornersBanner'
import Homework from '@/components/tiles/Homework'
import LiveClass from '@/components/tiles/LiveClass'
import NextClass from '@/components/tiles/NextClass'
import Survey from '@/components/tiles/Survey'

export default {
  name: 'class-content',
  mixins: [ PageStyle ],
  components: {
    Content,
    FourCornersBanner,
    Homework,
    LiveClass,
    NextClass,
    Survey
  },
  computed: {
    ...mapGetters(['classContent'])
  },
  methods: {
    contentComponent (type) {
      return {
        fourcorners: 'FourCornersBanner',
        nextclass: 'NextClass',
        liveclass: 'LiveClass',
        homework: 'Homework'
      }[type] || 'Content'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
</style>
