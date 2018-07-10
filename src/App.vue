<meta id="token" name="token" value="{{ csrf_token() }}"></meta>

<template lang="pug">

#app(v-bind:class="pageStyles")

  //- Modals
  info-modal
  question-modal
  media-upload-modal
  media-lightbox

  //- Authentication   
  authentication-flow

  //- Navigation
  left-drawer
  right-drawer

  transition(name="slide-top" appear mode="out-in")
    .warning-banner(v-if="!course.loaded")
      | Site is currently offline

  .main-page(v-if="course.loaded")
    navigation
    transition(name="fade" appear mode="out-in")
      keep-alive(v-bind:include="['content']")
        router-view

  #content-overlay(v-on:click="dismissOverlay" v-bind:class="{ 'visible': overlayVisible }")

</template>

<script>
  import { mapGetters } from 'vuex'
  
  // Components
  import Navigation from '@/components/navigation/Navigation'
  import LeftDrawer from '@/components/navigation/drawers/LeftDrawer'
  import RightDrawer from '@/components/navigation/drawers/RightDrawer'
  import AuthenticationFlow from '@/components/authentication/AuthenticationFlow'
  import MediaLightbox from '@/components/modals/MediaLightbox'
  
  import InfoModal from '@/components/modals/InfoModal'
  import QuestionModal from '@/components/modals/QuestionModal'
  import MediaUploadModal from '@/components/modals/MediaUploadModal'
  
  // Mixins
  import Overlay from '@/mixins/Overlay'

  export default {
    name: 'app',
    mixins: [
      Overlay,
    ],
    components: {
      Navigation,
      LeftDrawer,
      RightDrawer,
      AuthenticationFlow,
      MediaLightbox,
      InfoModal,
      QuestionModal,
      MediaUploadModal
    },
    watch: {
      '$route': {
        handler: function(nV, oV) {
          this.$store.dispatch('dismissDrawers')
          this.$store.dispatch('dismissOverlay')

          // Check for flash messages
          if (this.$route.query.flash) {
            // TODO: Make a modal with use of this.$route.query.flash.type
            // alert(this.$route.query.flash.msg)
          }
        },
        deep: true
      },
      '$route.params.classSlug': {
        handler: function(nV, oV) {
          if (nV && nV !== oV) {
            this.$store.dispatch('getClass', nV)
          }
        },
        deep: true
      },
      activeSegment(nV) {
        if (nV) {
          // Segment visible, disable scroll on window
          document.body.className = "disable-scroll"
        } else {
          document.body.className = "allow-scroll"
        }
      }
    },
    mounted() {
      this.$store.dispatch('checkAuth')

      this.$store.dispatch('getClass', this.$route.params.classSlug)
    },
    data() {
      return {
        navTitle: 'Connected Academy'
      }
    },
    computed: {
      ...mapGetters([
        'course', 'activeSegment', 'pageStyles', 'navigation', 'modalVisible',
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
      radius($corner-radius)
      margin 0 auto 80px auto
      max-width $col-width
      padding-top $navigation-height
      position relative
      width calc(100% - 20px)

      @media(max-width: 800px)
        margin-bottom 0

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

// Page background colors
html.primary #navigation { background-color: $color-primary }
html.home #navigation { background-color: $color-home }
html.registration #navigation { background-color: $color-registration }
html.survey #navigation { background-color: $color-survey }
html.schedule #navigation { background-color: $color-schedule }

// Just header and nav colors
html.homework #navigation { background-color: $color-homework }
html.fourcorners #navigation { background-color: $color-fourcorners }
html.profile #navigation { background-color: $color-profile }

.warning-banner
  pinned()
  animate()
  background $color-danger
  bottom auto
  color white
  height $navigation-height
  line-height $navigation-height
  position fixed
  text-align center

</style>
