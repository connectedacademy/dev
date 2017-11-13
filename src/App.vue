<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

#app(v-bind:class="pageStyles")


  //- Debug
  debug-panel(v-if="this.$store.state.debug" @click="this.$store.commit('TOGGLE_DEBUG_MODE')")

  //- Modals
  info-modal
  question-modal
  media-lightbox

  //- Authentication   
  authentication-flow
  //- lock(passcode="76234")

  //- Navigaiton
  navigation-button
  left-drawer
  right-drawer

  .main-page
    navigation

    #page-header(v-bind:class="{ minimized: navigation.minimized }")

    transition(name="fade" appear mode="out-in")
      keep-alive(include="course")
        router-view

  #content-overlay(v-on:click="dismissOverlay" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>
  import { mapGetters } from 'vuex';
  
  // Components
  import Navigation from '@/components/navigation/Navigation';
  import NavigationButton from '@/components/navigation/NavigationButton';
  import LeftDrawer from '@/components/navigation/drawers/LeftDrawer';
  import RightDrawer from '@/components/navigation/drawers/RightDrawer';
  import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';
  import MediaLightbox from '@/components/modals/MediaLightbox';
  import InfoModal from '@/components/modals/InfoModal';
  import QuestionModal from '@/components/modals/QuestionModal';
  import DebugPanel from '@/components/DebugPanel';
  // import Lock from '@/components/authentication/Lock';
  
  require('particles.js');


  // Mixins
  import Overlay from '@/mixins/Overlay';

  export default {
    name: 'app',
    mixins: [
      Overlay,
    ],
    watch: {
      activeSegment(nV) {
        if (nV) {
          // Segment visible, disable scroll on window
          document.body.className = "disable-scroll";
        } else {
          document.body.className = "allow-scroll";
        }
      },
    },
    mounted() {
      this.$store.dispatch('checkAuth');

      /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
      // particlesJS.load('page-header', '../../../static/particles.json', function () {
      //   console.log('callback - particles.js config loaded');
      // })
    },
    data() {
      return {
        navTitle: 'Connected Academy',
      };
    },
    computed: {
      ...mapGetters([
        'activeSegment', 'pageStyles', 'navigation', 'modalVisible',
      ]),
    },
    components: {
      DebugPanel,
      Navigation,
      NavigationButton,
      LeftDrawer,
      RightDrawer,
      AuthenticationFlow,
      MediaLightbox,
      InfoModal,
      QuestionModal,
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

html, body
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
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
    .container
      padding 20px
      h1
        reset()
        color $color-text-dark-grey
        margin-bottom 5px

    &#col-main
      radius(4px)
      margin 0 auto 60px auto
      max-width 780px
      padding-top $navigation-height
      position relative
      &.narrow
        max-width 640px    

      @media(max-width: 800px)
        max-width 100%
        margin 0 0px
        padding-top $navigation-height

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

#page-header
  transition(all 0.2s ease)
  background-color $color-primary
  height 160px + $navigation-height
  overflow hidden
  position absolute
  left 0
  right 0
  // top $navigation-height
  top 0
  text-align center
  z-index -1
  @media(max-width: 800px)
    height 84px + $navigation-height

  &.minimized
    height 0px

#app, html
  &.primary
    #page-header, #navigation
      background-color $color-primary
  &.registration
    #page-header, #navigation
      background-color $color-registration
  &.survey
    #page-header, #navigation
      background-color $color-survey

  &.homework
    #page-header, #navigation
      background-color $color-homework
  &.fourcorners
    #page-header, #navigation
      background-color $color-fourcorners
  &.profile
    #page-header, #navigation
      background-color $color-profile

html
  &.primary
    background-color $color-primary
  &.registration
    background-color $color-darkest-grey
  &.survey
    background-color $color-survey
</style>
