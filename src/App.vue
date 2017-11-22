<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

#app(v-bind:class="pageStyles")

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
  // import Lock from '@/components/authentication/Lock';
  
  require('particles.js');


  // Mixins
  import Overlay from '@/mixins/Overlay';

  export default {
    name: 'app',
    mixins: [
      Overlay,
    ],
    components: {
      Navigation,
      NavigationButton,
      LeftDrawer,
      RightDrawer,
      AuthenticationFlow,
      MediaLightbox,
      InfoModal,
      QuestionModal
    },
    watch: {
      '$route': {
        handler: function(nV, oV) {
          this.$store.dispatch('dismissDrawers')
          this.$store.dispatch('dismissOverlay')
        },
        deep: true
      },
      '$route.params.classSlug': {
        handler: function(nV, oV) {
          if (nV) {
            if (nV !== oV) {
              this.$store.dispatch('getSpec', nV);
            }
          }
        },
        deep: true
      },
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

      this.$store.dispatch('getSpec', this.$route.params.classSlug);

      setTimeout(() => {
        particlesJS.load('page-header', '../../../static/particles.json')
      }, 500)
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
    }
  }
</script>

<style lang="stylus">

@import '~stylus/shared'

html
  background-color $color-main-page
  transition background-color 0.6s
  &::-webkit-scrollbar
    display none

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

      @media(max-width: 800px)
        max-width 100%
        margin 0 0px
        padding-top $navigation-height

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
    height 104px + $navigation-height

  &.minimized
    height 0px

// Page background colors
html.primary, html.primary #page-header, html.primary #navigation { background-color: $color-primary; }
html.home, html.home #page-header, html.home #navigation { background-color: $color-home; }
html.registration, html.registration #page-header, html.registration #navigation { background-color: $color-registration; }
html.survey, html.survey #page-header, html.survey #navigation { background-color: $color-survey; }
html.schedule, html.schedule #page-header, html.schedule #navigation { background-color: $color-schedule; }

// Just header and nav colors
html.homework #page-header, html.homework #navigation { background-color: $color-homework; }
html.fourcorners #page-header, html.fourcorners #navigation { background-color: $color-fourcorners; }
html.profile #page-header, html.profile #navigation { background-color: $color-profile; }
</style>
