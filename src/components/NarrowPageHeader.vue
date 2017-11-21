<template lang="pug">
  .narrow-page-header
    h1.page-title {{ title }}
    h2.page-subtitle {{ subtitle }}
    router-link.page-link(v-bind:to="{ name: route }") {{ link }}
</template>

<script>
export default {
  name: 'narrow-page-header',
  props: ['title', 'subtitle', 'link', 'route']
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.narrow-page-header
  color white
  padding 0 10px
  position relative
  @media(max-width: 800px)
    padding 20px 20px 0 20px
  h1.page-title
    reset()
    font-size 1.8em
  a.page-link, h2.page-subtitle
    reset()
    color white
    font-size 1em
    font-weight bold
    text-decoration none
  a.page-link
    position absolute
    right 20px
    bottom 0
    &:hover
      cursor pointer
      text-decoration underline
</style>
