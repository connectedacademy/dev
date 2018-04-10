<template lang="pug">
  .narrow-page-header
    h1.page-title {{ prettyTitle }}
    h2.page-subtitle(v-html="subtitle")
    router-link.page-link(v-bind:to="{ name: route }") {{ link }}
</template>

<script>
import _capitalize from 'lodash/capitalize'

export default {
  name: 'narrow-page-header',
  props: ['title', 'subtitle', 'link', 'route'],
  computed: {
    prettyTitle () {
      return _capitalize(this.title)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.narrow-page-header
  color white
  padding 0 20px
  position relative
  @media(max-width: 800px)
    padding 20px 20px 0 20px
  h1.page-title
    reset()
    font-size 1.8em
    min-height 40px
  a.page-link, h2.page-subtitle
    reset()
    color white
    font-size 1em
    font-weight bold
    min-height 22px
    text-decoration none
  a.page-link
    position absolute
    right 20px
    bottom 0
    &:hover
      cursor pointer
      text-decoration underline
</style>
