<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

  #app(v-bind:class="pageStyle")

    .main-page

      navigation(v-bind:nav-title="navTitle")

      router-view(transition transition-mode="out-in")

    debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")

    section-navigator

    burger-menu

    left-drawer

    right-drawer(v-if="isRegistered")

    #action-panel(v-if="videoIsActive")

      playhead

      video-container(v-if="videoEnabled")

      message-composer

    authentication-flow

    .content-overlay(v-on:click="dismiss" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';

import store from './store/index';
import * as types from './store/mutation-types';

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

export default {
  name: 'app',
  created() {
    this.$store.dispatch('setColumnState', 'wide');
    this.$store.dispatch('getCourse');
    this.$store.dispatch('getHubs');
  },
  data() {
    return {
      navTitle: 'Connected Academy',
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'pageStyle', 'currentSection', 'videoIsActive', 'videoEnabled',
    ]),
    overlayVisible() {
      return this.$store.state.navigation.overlayVisible
      || this.$store.state.auth.visible
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
  },
  methods: {
    dismiss() {
      this.$store.commit(types.DISMISS_AUTH);
      this.$store.commit(types.DISMISS_COMPOSER);
      this.$store.commit(types.DISMISS_LEFT_DRAWER);
      this.$store.commit(types.DISMISS_RIGHT_DRAWER);
    },
  },
};

</script>

<style lang="stylus">

@import './assets/stylus/shared/*'
@import './assets/stylus/layout/page'

#action-panel
  background-color $color-purple
  position absolute
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
