<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

#app

  debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")

  authentication-flow

  section-navigator

  burger-menu

  left-drawer

  right-drawer(v-if="isRegistered")

  .main-page
    navigation
    router-view(transition transition-mode="out-in")

  #action-panel.animated.slideInUp(v-bind:class="{ hidden: !videoIsActive }")
    playhead
    video-container(v-if="videoEnabled")
    message-composer

  #content-overlay(v-on:click="dismissOverlay" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>
import { mapGetters } from 'vuex';

import store from '@/store';
import * as types from '@/store/mutation-types';

// Mixins
import ScrollPoints from '@/mixins/ScrollPoints';
import AutoScroll from '@/mixins/AutoScroll';

// Components
import AuthenticationFlow from './components/authentication/AuthenticationFlow';
import Navigation from './components/navigation/Navigation';
import SectionNavigator from './components/navigation/SectionNavigator';
import BurgerMenu from './components/navigation/BurgerMenu';
import LeftDrawer from './components/navigation/drawers/LeftDrawer';
import RightDrawer from './components/navigation/drawers/RightDrawer';
import DebugPanel from './components/DebugPanel';
import MessageComposer from './components/MessageComposer';
import VideoContainer from './components/VideoContainer';
import Playhead from './components/Playhead';
import Message from './components/conversation/Message';

export default {
  name: 'app',
  mixins: [
    ScrollPoints,
    AutoScroll,
  ],
  created() {
    // Fetch course and then hubs
    this.$store.dispatch('getCourse');
    this.$store.dispatch('getHubs');

    // Periodically update document height variable
    window.setInterval(this.updateDocumentHeight, 200);
  },
  data() {
    return {
      navTitle: 'Connected Academy',
      fps: 0.0,
      scrollPosition: 0.0,
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'videoIsActive', 'videoEnabled',
    ]),
    overlayVisible() {
      return this.$store.state.navigation.overlayVisible
      || this.$store.state.auth.visible
      || this.$store.state.conversation.activeSegmentVisible
      || this.$store.state.composer.visible;
    },
  },
  store,
  components: {
    AuthenticationFlow,
    DebugPanel,
    Navigation,
    SectionNavigator,
    BurgerMenu,
    LeftDrawer,
    RightDrawer,
    MessageComposer,
    VideoContainer,
    Playhead,
    Message,
  },
  methods: {
    dismissOverlay() {
      this.$store.commit(types.DISMISS_AUTH);
      this.$store.commit(types.DISMISS_COMPOSER);
      this.$store.commit(types.DISMISS_LEFT_DRAWER);
      this.$store.commit(types.DISMISS_RIGHT_DRAWER);
    },
    updateDocumentHeight() {
      // Check if document height has changed
      if (this.documentHeight !== document.documentElement.scrollHeight) {
        this.$log.log('Document height changed');
        this.documentHeight = document.documentElement.scrollHeight;
        this.setScrollPoints();
      }
    },
  },
};

</script>

<style lang="stylus">

@import './assets/stylus/shared/*'
@import './assets/stylus/layout/page'

#action-panel
  background-color white
  position fixed
  bottom 0
  left 50%
  margin-left -400px
  height 140px
  width 800px
  z-index 50
  @media(max-width: 800px)
    left 0
    margin-left 0
    width 100%

</style>
