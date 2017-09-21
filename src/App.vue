<meta id="token" name="token" value="{{ csrf_token() }}"></meta>
<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no"></meta>

<template lang="pug">

#app(v-bind:class="pageStyles")

  //- lock(passcode="76234")

  debug-panel(v-if="this.$store.state.debug" @click="this.$store.commit('TOGGLE_DEBUG_MODE')")

  authentication-flow

  //- like-modal

  media-lightbox

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
import store from '@/store';
import { mapGetters } from 'vuex';
import API from '@/api';

// Components
import Navigation from '@/components/navigation/Navigation';
import BurgerMenu from '@/components/navigation/BurgerMenu';
import SectionNavigator from '@/components/navigation/SectionNavigator';

// Mixins
import AutoScroll from '@/mixins/AutoScroll';
import Overlay from '@/mixins/Overlay';

export default {
  name: 'app',
  mixins: [
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
    this.$store.dispatch('checkAuth').then(() => {
      // Check if user has registered
      if (this.isAuthenticated && !this.isRegistered) {
        this.$router.push('/registration');
      } else {
        if (this.user && this.user.account) {
          this.$ga.set('userId', this.user.account);
        }
      }
    });

    this.$store.dispatch('getCourse');
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
    Navigation,
    BurgerMenu,
    SectionNavigator,
    'LeftDrawer': () => import('@/components/navigation/drawers/LeftDrawer'),
    'RightDrawer': () => import('@/components/navigation/drawers/RightDrawer'),
    'Lock': () => import('@/components/authentication/Lock'),
    'DebugPanel': () => import('@/components/DebugPanel'),
    'AuthenticationFlow': () => import('@/components/authentication/AuthenticationFlow'),
    'ActionPanel': () => import('@/components/conversation/ActionPanel'),
    'LikeModal': () => import('@/components/modals/LikeModal'),
    'MediaLightbox': () => import('@/components/modals/MediaLightbox'),
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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

  &.fourcorners
    .page-header
      background-color $color-darkest-grey

// Hide page header on colourful pages
html.colourful
  .page-header
    display none
</style>
