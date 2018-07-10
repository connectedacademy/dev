<template lang="pug">
  
  #media-lightbox.animated.fadeIn(v-bind:class="{ active: lightboxVisible }" @click="toggleLightbox()")
    #lightbox--close(@click="toggleLightbox()")
      i.fas.fa-times.fa-2x
    .image-wrapper.animated.fadeIn(v-bind:style="{ 'background-image': `url('${CDN}/media/${currentLightboxMedia}')` }")

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
  background-color alpha(black, 0.9)
  display none
  pointer-events none
  position fixed
  z-index 65

  &.active
    display block
    pointer-events all

  #lightbox--close
    color white
    cursor pointer
    position fixed
    top 0
    right 0
    padding 30px

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
