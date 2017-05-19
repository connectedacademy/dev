<template lang="pug">

.debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")
  p {{ `scrollPosition - ${scrollPosition}` }}
  p {{ `offsetScrollPosition - ${offsetScrollPosition}` }}
  span
    p currentSection
    pre {{ currentSection }}
  span.hidden
    p currentActiveSection
    pre {{ currentActiveSection }}
  span
    p scrollPoints
    pre {{ scrollPoints }}
  p {{ `videoEnabled - ${videoEnabled}` }}
  p {{ `autoPlaying - ${autoPlaying}` }}
  p {{ `canAutoScroll - ${canAutoScroll}` }}
  p {{ `currentTime - ${currentTime}` }}
  p {{ `currentSectionScrollPosition - ${currentSectionScrollPosition}` }}
  p {{ `currentSegmentGroup - ${currentSegmentGroup}` }}
  p {{ `currentSegment - ${currentSegment}` }}
  button.pure-button(@click="setPosition") Set Position

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
      'videoEnabled',
      'autoPlaying',
      'canAutoScroll',
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
  methods: {
    setPosition() {
      const ele = document.getElementById('col-main');
      alert(this.$store.getters.currentSection.top);
      ele.scrollTop = `${this.$store.getters.currentSection.top}px`;

    },
  },
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
  top 100px
  left 10px
  z-index 52
  overflow scroll

</style>
