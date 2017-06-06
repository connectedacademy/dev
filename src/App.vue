<meta id="token" name="token" value="{{ csrf_token() }}"></meta>
<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no"></meta>

<template lang="pug">

#app

  debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")

  authentication-flow

  section-navigator

  burger-menu

  left-drawer

  right-drawer(v-if="isRegistered")

  .main-page(v-bind:style="{ 'padding-top': (this.$store.getters.navigationVisible) ? '60px' : '0px' }")
    navigation
    router-view(transition transition-mode="out-in")

  action-panel(v-bind:composer-hidden="composerHidden" v-bind:video-is-active="videoIsActive" v-bind:active-segment-visible="activeSegmentVisible")

  #content-overlay(v-on:click="dismissOverlay" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>
import { mapGetters } from 'vuex';
import API from '@/api';

import store from '@/store';
import * as types from '@/store/mutation-types';
import Moment from 'moment';

// Mixins
import ScrollPoints from '@/mixins/ScrollPoints';
import AutoScroll from '@/mixins/AutoScroll';
import Overlay from '@/mixins/Overlay';

// Components
import AuthenticationFlow from './components/authentication/AuthenticationFlow';
import Navigation from './components/navigation/Navigation';
import SectionNavigator from './components/navigation/SectionNavigator';
import BurgerMenu from './components/navigation/BurgerMenu';
import LeftDrawer from './components/navigation/drawers/LeftDrawer';
import RightDrawer from './components/navigation/drawers/RightDrawer';
import DebugPanel from './components/DebugPanel';
import ActionPanel from './components/conversation/ActionPanel';

export default {
  name: 'app',
  mixins: [
    ScrollPoints,
    AutoScroll,
    Overlay,
  ],
  watch: {
    activeSegmentVisible(nV, oV) {
      if (nV) {
        // Segment visible, disable scroll on window
        document.body.className = "disable-scroll";
      } else {
        document.body.className = "allow-scroll";
      }
    },
  },
  created() {
    var self = this;
    this.$store.dispatch('checkAuth').then(function() {
      // Check if user has registered
      if (self.isAuthenticated && !self.isRegistered) {
        self.$router.push('/registration');
      } else {
        self.$ga.set('userId', self.$store.state.auth.user.account);
      }
    });

    // Fetch course and then hubs// Set faux time
    const fauxTime = Moment().format();
    this.$store.commit('setFauxTime', fauxTime);

    this.$store.dispatch('getCourse');
    this.$store.dispatch('getHubs');

    // Periodically update document height variable
    window.setInterval(this.updateDocumentHeight, 200);
  },
  data() {
    return {
      navTitle: 'Connected Academy',
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'videoIsActive', 'activeSegmentVisible', 'composerHidden',
    ]),
    overlayVisible() {
      return this.$store.state.navigation.overlayVisible
      || this.$store.state.auth.visible
      || this.$store.state.conversation.activeSegmentVisible;
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
    ActionPanel,
  },
  methods: {
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

@import '~stylus/shared'

html, body
  background-color $color-main-page
  margin 0
  padding 0

body.disable-scroll
  overflow hidden
  min-height 100%
  max-height 100vh
  padding-bottom 1px
  top 0
  left 0
  right 0
  bottom 0

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

.main-page
  padding-top 60px

  .col
    box-sizing border-box
    padding 0
    top 60px

    .container
      padding 20px
      h1
        reset()
        color $color-text-dark-grey
        margin-bottom 5px

  .col#col-main
    radius(4px)
    margin 0 auto 60px auto
    max-width 780px
    @media(max-width: 800px)
      max-width 100%
      margin 0 0px

/* App states */

#app.authenticating
  .main-page
    .col
      top 0

#content-overlay
  pinned()
  background-color alpha(black, 0)
  pointer-events none
  position fixed
  transition background-color 0.6s
  z-index 50
  &.visible
    background-color alpha(black, 0.85)
    pointer-events all

</style>
