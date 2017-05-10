<template lang="pug">

.debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")
  p currentSection
  pre {{ currentSection }}
  p {{ `videoEnabled - ${videoEnabled}` }}
  p {{ `autoPlaying - ${autoPlaying}` }}
  p {{ `scrollPosition - ${scrollPosition}` }}
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
      'videoEnabled',
      'autoPlaying',
      'scrollPosition',
      'currentTime',
      'currentSectionScrollPosition',
      'currentSegmentGroup',
      'currentSegment',
    ]),
  },
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
