<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

  #app(v-bind:class="pageStyle")

    .main-page

      navigation(v-bind:nav-title="navTitle")

      router-view(transition transition-mode="out-in")

      video-container

    .debug-panel
      p {{ `scrollPosition - ${$store.getters.scrollPosition}` }}
      p {{ `currentTime - ${$store.getters.currentTime}` }}
      p {{ `currentSection - ${$store.getters.currentSection}` }}

    burger-menu

    left-drawer

    right-drawer(v-if="registered")

    message-composer

    authentication-flow

    .content-overlay(v-on:click="dismiss" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>

import AuthenticationFlow from './components/authentication/AuthenticationFlow';
import Navigation from './components/navigation/Navigation';
import BurgerMenu from './components/navigation/BurgerMenu';
import LeftDrawer from './components/navigation/drawers/LeftDrawer';
import RightDrawer from './components/navigation/drawers/RightDrawer';
import MessageComposer from './components/MessageComposer';
import VideoContainer from './components/VideoContainer';

import store from './store/index';
import * as types from './store/mutation-types';

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
    registered() {
      return this.$store.getters.isRegistered;
    },
    pageStyle() {
      return this.$store.getters.pageStyle;
    },
    overlayVisible() {
      return this.$store.state.navigation.overlayVisible
      || this.$store.state.auth.visible
      || this.$store.state.composer.visible;
    },
  },
  store,
  components: {
    AuthenticationFlow,
    Navigation,
    BurgerMenu,
    LeftDrawer,
    RightDrawer,
    MessageComposer,
    VideoContainer,
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

<style lang="stylus" scoped>

@import './assets/stylus/shared/*'
@import './assets/stylus/layout/page'

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
