<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

  #app(v-bind:class="pageStyle")

    .main-page

      navigation(v-bind:nav-title="navTitle")

      router-view(transition transition-mode="out-in")

    burger-menu

    left-drawer

    right-drawer

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

<style lang="styl">

@import "./assets/stylus/shared/*";
@import "./assets/stylus/layout/page";

</style>
