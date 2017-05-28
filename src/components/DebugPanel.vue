<template lang="pug">

.debug-panel(v-if="this.$store.state.debug")
  p {{ `scrollPosition - ${scrollPosition}` }}
  p {{ `offsetScrollPosition - ${offsetScrollPosition}` }}
  span
    p currentSection
    pre {{ currentSection }}
  span
    p currentActiveSection
    pre {{ currentActiveSection }}
  span
    p scrollPoints
    pre {{ scrollPoints }}
  p {{ `autoPlaying - ${autoPlaying}` }}
  p {{ `currentTime - ${currentTime}` }}
  p {{ `currentSectionScrollPosition - ${currentSectionScrollPosition}` }}
  p {{ `currentSegmentGroup - ${currentSegmentGroup}` }}
  p {{ `currentSegment - ${currentSegment}` }}

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
      'autoPlaying',
      'scrollPosition',
      'offsetScrollPosition',
      'currentTime',
      'currentSectionScrollPosition',
      'currentSegmentGroup',
      'currentSegment',
      'scrollPoints',
      'chunkedMessages',
    ]),
  },
  components: {},
  methods: {},
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.debug-panel
  background-color alpha(red, 0.8)
  color white
  min-width 200px
  padding 10px
  position fixed
  bottom 60px
  top 60px
  left 10px
  z-index 52
  overflow-y scroll
  overflow-x none

</style>
