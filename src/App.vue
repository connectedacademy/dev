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
  burger-menu
  left-drawer
  right-drawer

  .main-page
    navigation

    .page-header(v-bind:class="{ minimized: navigation.minimized }")

    transition(name="fade" appear mode="out-in")
      keep-alive(include="course")
        router-view

  #content-overlay(v-on:click="dismissOverlay" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>
  import { mapGetters } from 'vuex';
  
  // Components
  import Navigation from '@/components/navigation/Navigation';
  import BurgerMenu from '@/components/navigation/BurgerMenu';
  import LeftDrawer from '@/components/navigation/drawers/LeftDrawer';
  import RightDrawer from '@/components/navigation/drawers/RightDrawer';
  import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';
  import MediaLightbox from '@/components/modals/MediaLightbox';
  import InfoModal from '@/components/modals/InfoModal';
  import QuestionModal from '@/components/modals/QuestionModal';
  import DebugPanel from '@/components/DebugPanel';
  // import Lock from '@/components/authentication/Lock';
  
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
      BurgerMenu,
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
  &.colourful
    background-color $color-primary

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
    padding-top $navigation-height + 20px
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
  height 160px
  position absolute
  left 0
  right 0
  top $navigation-height
  text-align center
  z-index -1
  @media(max-width: 800px)
    height 84px

  &.minimized
    height 0px

// Hide page header on colourful pages
html.colourful
  .page-header
    display none
</style>
