<meta id="token" name="token" value="{{ csrf_token() }}"></meta>
<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no"></meta>

<template lang="pug">

#app(v-bind:class="pageStyles")

  lock(passcode="76234")

  debug-panel(v-if="this.$store.state.debug" @click="$store.commit('TOGGLE_DEBUG_MODE')")

  authentication-flow

  section-navigator

  burger-menu

  left-drawer

  right-drawer(v-if="isRegistered")

  .main-page(v-bind:style="{ 'padding-top': (this.$store.getters.navigationVisible) ? '0' : '0px' }")

    navigation

    .page-header(v-bind:class="{ minimized: navigation.minimized }")

    transition(name="fade" appear mode="out-in")
      keep-alive
        router-view

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
import Lock from '@/components/authentication/Lock'
import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';
import Navigation from '@/components/navigation/Navigation';
import SectionNavigator from '@/components/navigation/SectionNavigator';
import BurgerMenu from '@/components/navigation/BurgerMenu';
import LeftDrawer from '@/components/navigation/drawers/LeftDrawer';
import RightDrawer from '@/components/navigation/drawers/RightDrawer';
import DebugPanel from '@/components/DebugPanel';
import ActionPanel from '@/components/conversation/ActionPanel';

export default {
  name: 'app',
  mixins: [
    ScrollPoints,
    AutoScroll,
    Overlay,
  ],
  watch: {
    activeSegment(nV, oV) {
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
        if (self.user && self.user.account) {
          self.$ga.set('userId', self.user.account);
        }
      }
    });

    this.$store.dispatch('getCourse');
    this.$store.dispatch('getHubs');

    // Periodically update document height variable
    window.setInterval(this.updateDocumentHeight, 1000);
  },
  mounted() {
    // Subscribe to socket
    API.message.subscribeToSocket();
  },
  data() {
    return {
      navTitle: 'Connected Academy',
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'activeSegment', 'peekSegment', 'pageStyles', 'user', 'navigation',
    ]),
    overlayVisible() {
      return this.$store.state.navigation.overlayVisible
      || this.$store.state.auth.visible
      || this.$store.state.conversation.activeSegment
      || this.$store.state.conversation.peekSegment
      || this.$store.state.conversation.likeModalVisible;
    },
  },
  store,
  components: {
    Lock,
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
    goBack() {
      this.$router.go(-1);
    },
    updateDocumentHeight() {
      // Check if document height has changed
      if (this.documentHeight !== document.documentElement.scrollHeight) {
        this.$log.info('Document height changed');
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
  &::-webkit-scrollbar
    display none
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
    box-sizing()
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
    &.narrow
      max-width 640px    

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
  transition background-color 0.3s
  z-index 55
  &.visible
    background-color alpha(black, 0.8)
    pointer-events all

// Page header

.page-header
  transition(all 0.2s ease)
  background-color $color-primary
  height 240px
  position absolute
  left 0
  right 0
  top $navigation-height
  top 0
  text-align center
  z-index -1

  &.minimized
    height 60px

#app
  &.chat
    .page-header
      background-color $color-homework

  &.admin
    .page-header
      background-color $color-darkest-grey

// Hide page header on colourful pages
html.colourful
  .page-header
    display none
</style>
