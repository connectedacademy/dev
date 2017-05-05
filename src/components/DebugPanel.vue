<template lang="pug">

.debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")
  p currentSection
  pre {{ currentSection }}
  p {{ `videoEnabled - ${$store.state.videoEnabled}` }}
  p {{ `autoPlaying - ${$store.state.autoPlaying}` }}
  p {{ `scrollPosition - ${$store.getters.scrollPosition}` }}
  p {{ `currentTime - ${$store.getters.currentTime}` }}
  p {{ `currentSectionScrollPosition - ${$store.getters.currentSectionScrollPosition}` }}
  p {{ `currentSegmentGroup - ${$store.getters.currentSegmentGroup}` }}
  p {{ `currentSegment - ${$store.getters.currentSegment}` }}

</template>

<script>
export default {
  name: 'debug-panel',
  data() {
    return {};
  },
  computed: {},
  components: {},
  methods: {},
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.debug-panel
  background-color red
  color white
  min-width 200px
  padding 10px
  position fixed
  bottom 10px
  left 10px
  z-index 52

</style>
