<meta id="token" name="token" value="{{ csrf_token() }}"></meta>
<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no"></meta>

<template lang="pug">

#app(v-bind:class="pageStyles")

  debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")

  authentication-flow

  section-navigator

  burger-menu

  left-drawer

  right-drawer(v-if="isRegistered")

  .main-page(v-bind:style="{ 'padding-top': (this.$store.getters.navigationVisible) ? '0' : '0px' }")

    navigation

    .page-header(v-bind:class="{ minimal: minimalHeader, minimized: navigation.minimized }")

    transition(name="fade" appear mode="out-in")
      keep-alive
        router-view

  //- #media-panel(v-if="videoIsActive")
    video-container

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
import VideoContainer from './components/VideoContainer';

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
    videoIsActive(nV, oV) {
      if (nV) {
        // Segment visible, disable scroll on window
        // document.documentElement.className = "dark-mode";
      } else {
        // document.documentElement.className = "light-mode";
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
        if (self.user && self.user.account) {
          self.$ga.set('userId', self.user.account);
        }
      }
    });

    // Fetch course and then hubs
    const fauxTime = Moment().format();
    this.$store.commit('setFauxTime', fauxTime);

    this.$store.dispatch('getCourse');
    this.$store.dispatch('getHubs');

    // Periodically update document height variable
    window.setInterval(this.updateDocumentHeight, 500);
  },
  data() {
    return {
      navTitle: 'Connected Academy',
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'videoIsActive', 'activeSegmentVisible', 'composerHidden', 'minimalHeader', 'pageStyles', 'user', 'navigation',
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
    VideoContainer,
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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

@import '~stylus/shared'

html
  background-color $color-main-page
  transition background-color 0.6s
  &.colourful
    background-color $color-primary
  &.dark-mode
    background-color #242424

html, body
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

.main-page

  .col
    box-sizing border-box
    padding 0
    /*top 60px*/

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
    padding-top 80px
    position relative
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
  z-index 55
  &.visible
    background-color alpha(black, 0.85)
    pointer-events all

// Page header

.page-header
  transition(height 0.2s ease)
  background linear-gradient(bottom, darken($color-primary, 10%), lighten($color-primary, 5%))
  height 240px
  position fixed
  left 0
  right 0
  text-align center
  z-index -1

  &:after
    animate()
    pinned()
    content ''
    background-color $color-darkest-grey
    position absolute
    opacity 0
  &.minimized
    background linear-gradient(bottom, $color-primary, lighten($color-primary, 5%))
    height 80px
  &.minimal
    height 80px
    &:after
      opacity 1

#app.chat .page-header.minimal:after
  background-color $color-homework

// Hide page header on colourful pages
html.colourful
  .page-header
    display none

#media-panel
  pinned()
  position fixed
  top 0
  bottom auto
  background-color $color-darkest-grey
  background-color white
  border-bottom $color-border 1px solid
  box-shadow 0 0 5px 5px alpha(black, 0.1)
  /*height 140px*/
  width 780px
  left 50%
  margin-left calc(-780px / 2)
  z-index 50
  text-align center
</style>
