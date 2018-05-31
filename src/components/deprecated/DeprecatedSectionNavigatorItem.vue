<template lang="pug">

li.navigation-item(v-bind:name="`navigator-${scrollPoint.slug}`" @click="jumpToContent(scrollPoint.slug)")
  i.fas.fa-play(v-if="scrollPoint.type === 'class'")
  i.fas.fa-play(v-else-if="scrollPoint.type === 'webinar'")
  i.fas.fa-circle(v-else)

  .content-label {{ scrollPoint.title }}
  .clearfix

</template>

<script>

export default {
  name: 'section-navigator-item',
  props: ['scrollPoint'],
  methods: {
    jumpToContent(slug) {
      this.$logging.logEvent('section-navigator', 'navigated-to', slug)

      const segmentPosition = this.scrollPoint.sectionTop + 1

      this.$store.commit('PAUSE_MEDIA')

      setTimeout(() => {
        window.scroll(0, segmentPosition)
      }, 200)
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

li.navigation-item
  animate()
  cleanlist()
  hover($color-primary)
  width 100%
  position relative
  height calc(40px)
  overflow hidden
  svg
    color white
    float left
    padding 14px
    height 12px
    width 12px
    animate()
  .content-label
    animate()
    color white
    font-weight bold
    line-height 40px
    padding 0 15px 0 40px
    position absolute
    left 0
    right 0
    text-transform capitalize
    z-index 1
    pointer-events none
</style>
