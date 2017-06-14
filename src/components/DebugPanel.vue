<template lang="pug">

.debug-panel(v-if="this.$store.state.debug")
  span
    p currentSection
    pre {{ currentSection }}
  span
    p currentActiveSection
    pre {{ currentActiveSection }}
  span
    p scrollPoints
    pre {{ scrollPoints }}

  p {{ `fauxTime - ${fauxTime}` }}
  p {{ `scrollPosition - ${scrollPosition}` }}
  p {{ `offsetScrollPosition - ${offsetScrollPosition}` }}

  p {{ `autoPlaying - ${autoPlaying}` }}
  p {{ `currentTime - ${currentTime}` }}
  p {{ `currentSectionScrollPosition - ${currentSectionScrollPosition}` }}
  p {{ `currentSegmentGroup - ${currentSegmentGroup}` }}
  p {{ `currentSegment - ${currentSegment}` }}

  p {{ `videoPlaying - ${videoPlaying}` }}
  p {{ `videoReady - ${videoReady}` }}

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'debug-panel',
  data() {
    return {};
  },
  computed: {
    ...mapGetters([
      'currentSection',
      'currentActiveSection',
      'scrollPoints',

      'fauxTime',
      'scrollPosition',
      'offsetScrollPosition',

      'autoPlaying',
      'currentTime',
      'currentSectionScrollPosition',
      'currentSegmentGroup',
      'currentSegment',

      'videoPlaying',
      'videoReady',
    ]),
  },
  components: {},
  methods: {},
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.debug-panel
  background-color alpha(red, 0.8)
  color white
  max-width 300px
  min-width 200px
  padding 10px
  position fixed
  bottom 60px
  top 60px
  left 10px
  z-index 52
  overflow-y auto
  overflow-x none

</style>
