<template lang="pug">

#four-corners-banner(v-bind:class="{ expanded: expanded }")
  #tile-wrapper

    .tile#info-tile
      h1(name="4c-banner-title" v-if="expanded && (currentCorner !== 'default')") {{ corners[currentCorner].title }}
      img(v-if="!expanded || (currentCorner === 'default')" src="../../assets/logos/fourcorners/white-text.svg" height="20")

      p {{ (expanded) ? corners[currentCorner].text : bannerText }}
      .buttons
        router-link.pure-button.pure-button-subtle(name="4c-learn-more" v-if="currentCorner !== 'default'" to="/fourcorners") Learn More
        .pure-button.pure-button-subtle(name="4c-minimize" v-if="currentCorner === 'default' && expanded" @click="currentCorner = 'default'; expanded = false") Minimize
        .pure-button.pure-button-subtle(name="4c-minimize" v-if="currentCorner === 'default' && !expanded" @click="currentCorner = 'bottomRight'; expanded = true") Explore

    #corners
      .corner#corner-top-left(name="4c-banner-top-left" v-bind:class="{ active: currentCorner === 'topLeft' }" @click="toggleCorner('topLeft')")
      .corner#corner-top-right(name="4c-banner-top-right" v-bind:class="{ active: currentCorner === 'topRight' }" @click="toggleCorner('topRight')")
      .corner#corner-bottom-left(name="4c-banner-bottom-left" v-bind:class="{ active: currentCorner === 'bottomLeft' }" @click="toggleCorner('bottomLeft')")
      .corner#corner-bottom-right(name="4c-banner-bottom-right" v-bind:class="{ active: currentCorner === 'bottomRight', pulsing: currentCorner === 'default' }" @click="toggleCorner('bottomRight')")

</template>

<script>
export default {
  name: 'four-corners-banner',
  props: ['content'],
  data() {
    return {
      expanded: false,
      bannerText: 'Click explore to learn how FourCorners offers a new way of enriching photographs with rich metadata.',
      corners: {
        default: {
          icon: 'picture-o',
          title: 'FourCorners',
          text: 'Explore each corner to learn the types of contextual information that can be linked in a FourCorners image'
        },
        topLeft: {
          icon: 'history',
          title: 'Image Context',
          text: 'You can add photographs and video that add more information and context, such as those made before or after the event shown, or from other perspectives, or images that supplement a portrait.',
        },
        topRight: {
          icon: 'share-square',
          title: 'Links',
          text: 'Include links here to websites that contain an accompanying article, related video, historical explanation, or any other contextualizing information; you can also link to the photographer’s website or that of an agency or publication.',
        },
        bottomLeft: {
          icon: 'info-circle',
          title: 'Backstory',
          text: 'Here you can describe in text or video what was going on behind the scenes that is not obvious in the photograph itself, or include the point of view of the subject or a witness.',
        },
        bottomRight: {
          icon: 'copyright',
          title: 'Copyright/License',
          text: 'Here you can specify how you want to protect the copyright of your image, asserting a copyright for yourself or another entity. Alternatively you could add a Creative Commons license.',
        },
      },
      currentCorner: 'default'
    }
  },
  methods: {
    toggleCorner(corner) {
      if (this.expanded) {
        if (corner === this.currentCorner) {
          this.expanded = false
          this.currentCorner = 'default'
        }
        else {
          this.currentCorner = corner
        }
      }
      else {
        // this.$store.dispatch('showQuestionModal', { title: 'Question', body: 'Have you used FourCorners before?', action: 'Yes' })
        this.currentCorner = 'bottomRight'
        this.expanded = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/layout/course-content'

$corner-size = 50px
$corner-offset = 15px
$corner-width = 8px

#four-corners-banner
  radius(6px)
  background-color #0B2130
  background url('../../assets/images/lake.jpg')
  background-image()
  background-position center right

  margin-top $tile-spacing
  overflow hidden
  position relative
  text-align center

  @media(max-width: 800px)
    radius(0)

  &:after
    animate()
    pinned()
    background-color alpha(black, 0.5)
    content ''
    position absolute
    pointer-events none
    z-index 0

  #tile-wrapper
    animate()
    transition-duration 1s
    height 130px
    overflow visible
    padding 50px 30px
    position relative
    z-index 1
    h1, h2, h3, h4, h5, p
      reset()
      color white
      margin 0 auto
      max-width 460px
      padding 0 5px
    h1
      padding 0 20px 10px 20px
    p
      line-height 20px
      margin 0 auto
      margin-bottom 10px
      min-height 40px
      max-height 60px
      overflow hidden

    .pure-button
      background-color alpha(white, 0.1)
      border-color transparent
      color white
      margin 10px auto 5px auto
      &:hover
        background-color white
        color $color-darkest-grey

    .tile
      &#info-tile
        img
          padding 10px
        .buttons
          .pure-button
            display inline-block
            margin 0 5px
        svg
          color white
          font-size 3em
          margin 0 auto

    #corners
      .corner
        animate()
        cursor pointer
        opacity 0
        position absolute
        height $corner-size
        width $corner-size
        &:hover
          opacity 1
        &#corner-top-left
          border-top white $corner-width solid
          border-left white $corner-width solid
          left $corner-offset
          top $corner-offset
        &#corner-top-right
          border-top white $corner-width solid
          border-right white $corner-width solid
          right $corner-offset
          top $corner-offset
        &#corner-bottom-left
          border-bottom white $corner-width solid
          border-left white $corner-width solid
          left $corner-offset
          bottom $corner-offset
        &#corner-bottom-right
          border-bottom white $corner-width solid
          border-right white $corner-width solid
          right $corner-offset
          bottom $corner-offset
          opacity 0.3
          &.pulsing
            animation pulse 2s infinite

          &:hover
            opacity 1 !important

        &#corner-top-left
          transition-delay 0.3s

        &#corner-top-right
          transition-delay 0.1s

        &#corner-bottom-left
          transition-delay 0.5s

        &.active
          border-color #0cf !important
          opacity 1 !important


  &.expanded
    &:after
      pinned()
      background-color alpha(black, 0.8)
    #tile-wrapper
      padding 90px 40px 120px 40px
      #corners
        .corner
          opacity 0.3
          transition-delay 0s !important
          &:hover
            opacity 1



@-webkit-keyframes pulse
  0%
    opacity 0.6
  50%
    opacity 0.2
  100%
    opacity 0.6

@keyframes pulse
  0%
    opacity 0.6
  50%
    opacity 0.2
  100%
    opacity 0.6
</style>
