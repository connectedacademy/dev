<template lang="pug">
  .fourcorners-interaction-wrapper

    .fourcorners-interaction
      .dialog(v-bind:class="{ active: (activeCorner !== undefined) }")
        img(src="../../assets/logos/fourcorners/white.svg" height="40" v-if="activeCorner === undefined")
        .dialog--text(v-if="activeCorner !== undefined")
          h1 {{ corners[activeCorner].title }}
          p {{ corners[activeCorner].description }}
      .fourcorners-interaction--icon.animated.fadeIn#icon-tl(v-for="(corner, key) in corners" v-bind:id="`icon-${key}`" v-bind:class="{ active: (key === activeCorner) }" @click="activeCorner = key")
        .icon

    .corner-navigator
      .corner-navigator--corner.tl-corner(@click="activeCorner = 'tl'")
        .corner-navigator--corner-illustration.animated.fadeIn
        .corner-navigator--corner-title Upper Left Corner
        .corner-navigator--corner-subtitle is for image context

      .corner-navigator--corner.tr-corner(@click="activeCorner = 'tr'")
        .corner-navigator--corner-illustration.animated.fadeIn
        .corner-navigator--corner-title Upper Right Corner
        .corner-navigator--corner-subtitle is for links to other sites

      .clearfix

    .corner-navigator
      .corner-navigator--corner.bl-corner(@click="activeCorner = 'bl'")
        .corner-navigator--corner-illustration.animated.fadeIn
        .corner-navigator--corner-title Bottom Left Corner
        .corner-navigator--corner-subtitle is for the backstory

      .corner-navigator--corner.br-corner(@click="activeCorner = 'br'")
        .corner-navigator--corner-illustration.animated.fadeIn
        .corner-navigator--corner-title Bottom Right Corner
        .corner-navigator--corner-subtitle is for the copyright and license

      .clearfix
</template>

<script>
export default {
  name: 'four-corners-interaction',
  data() {
    return {
      activeCorner: undefined,
      corners: {
        tl: {
          title: 'Related Images or Videos',
          description: 'You can add photographs and video that add more information and context, such as those made before or after the event shown, or from other perspectives, or images that supplement a portrait.',
        },
        tr: {
          title: 'Links to Related Content',
          description: 'Include links here to websites that contain an accompanying article, related video, historical explanation, or any other contextualizing information; you can also link to the photographer’s website or that of an agency or publication.',
        },
        bl: {
          title: 'Backstory',
          description: 'This is where you give the backstory for your image. What lead to the picture being taken, who was involved in the capture of the image and what the story is around the image.',
        },
        br: {
          title: 'Copyright and Licensing',
          description: 'Here you can specify how you want to protect the copyright of your image, asserting a copyright for yourself or another entity.',
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.corner-navigator
  margin-top 20px
  .corner-navigator--corner
    box-sizing()
    float left
    position relative
    width 50%
    @media(max-width: 560px)
      display none
    &:hover
      cursor pointer

    .corner-navigator--corner-illustration
      border $color-border 5px solid 
      position absolute
      height 50px
      width 50px
      &:before
        content ''
        height 20px
        width 20px
        position absolute
    .corner-navigator--corner-title
      color $color-text-dark-grey
      font-weight bold
      line-height 30px
    .corner-navigator--corner-subtitle
      color $color-text-grey
      line-height 30px

    &.tl-corner, &.bl-corner
      padding-left 70px
      text-align left
      .corner-navigator--corner-illustration
        left 0px
      &.tl-corner .corner-navigator--corner-illustration:before
        border-top $color-fourcorners 5px solid
        border-left $color-fourcorners 5px solid
        top -5px
        left -5px
      &.bl-corner .corner-navigator--corner-illustration:before
        border-bottom $color-fourcorners 5px solid
        border-left $color-fourcorners 5px solid
        bottom -5px
        left -5px
    &.tr-corner, &.br-corner
      padding-right 70px
      text-align right
      .corner-navigator--corner-illustration
        right 0px
      &.tr-corner .corner-navigator--corner-illustration:before
        border-top $color-fourcorners 5px solid
        border-right $color-fourcorners 5px solid
        top -5px
        right -5px
      &.br-corner .corner-navigator--corner-illustration:before
        border-bottom $color-fourcorners 5px solid
        border-right $color-fourcorners 5px solid
        bottom -5px
        right -5px

.fourcorners-interaction
  radius(6px)
  background-image()
  background-color $color-darkest-grey
  background url('../../assets/images/lake.jpg')
  background-size cover
  height 320px
  margin 0 0 20px 0
  overflow hidden
  position relative
  @media(max-width: 560px)
    margin 0px 0
  .dialog
    pinned()
    animate()
    background-color alpha(black, 0.2)
    overflow auto
    padding 50px 70px
    position absolute
    text-align center
    img
      height 40px
      width 240px
      margin 0 auto
      top 50%
      left 50%
      margin-left -120px
      position absolute
      margin-top -20px
    .dialog--text
      color white
      margin 0 auto
      max-width 440px
      opacity 0
      text-align center
    &.active
      background-color alpha(black, 0.5)
      .dialog--text
        opacity 1
  .fourcorners-interaction--icon
    radius(50%)
    animate()
    background-color alpha(black, 0.0)
    height 30px
    width 30px
    padding 10px
    position absolute
    opacity 0.7
    .icon
      background-image()
      position absolute
      top 5px
      left 5px
      right 5px
      bottom 5px
    &:hover, &.active
      cursor pointer
      background-color alpha(black, 0.7)
      opacity 1.0
    &#icon-tl
      top 10px
      left 10px
      .icon
        background url(../../assets/icons/fourcorners/gallery.svg)
    &#icon-tr
      top 10px
      right 10px
      .icon
        background url(../../assets/icons/fourcorners/info.svg)
    &#icon-bl
      bottom 10px
      left 10px
      .icon
        background url(../../assets/icons/fourcorners/link.svg)
    &#icon-br
      bottom 10px
      right 10px
      .icon
        background url(../../assets/icons/fourcorners/copyright.svg)
</style>
