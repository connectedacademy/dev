<template lang="pug">
  
  #media-lightbox.animated.fadeIn(v-bind:class="{ active: lightboxVisible }" @click="toggleLightbox()")
    #lightbox--close(@click="toggleLightbox()")
      icon(icon="times")
    #loading
      icon(icon="image")
      span Loading Image
    .image-wrapper.animated.fadeIn(v-bind:style="{ 'background-image': `url('${currentLightboxMedia}')` }")

</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters } from 'vuex'

export default {
  name: 'media-lightbox',
  computed: {
    ...mapGetters(['CDN', 'currentLightboxMedia', 'lightboxVisible'])
  },
  methods: {
    toggleLightbox() {
      this.$store.commit(types.SET_LIGHTBOX_MEDIA, undefined)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#media-lightbox
  pinned()
  background-color white
  display none
  pointer-events none
  position fixed
  z-index 65

  &.active
    display block
    pointer-events all
  
  #loading
    opacity 0.2
    font-size 10em
    position fixed
    top 50%
    left 50%
    transform translateX(-50%) translateY(-50%)
    text-align center
    span
      display block
      font-size .2em

  #lightbox--close
    color black
    cursor pointer
    position fixed
    top 0
    right 0
    padding 30px
    svg
      font-size 2em

  .image-wrapper
    pinned()
    background-image()
    position fixed
    background-size contain
    top 10%
    bottom 10%
    left 10%
    right 10%

</style>
