<template lang="pug">

.page(name="about-page")
  .col#col-main
    .main-container
      narrow-page-header(:title="$route.meta.title" :subtitle="$route.meta.subtitle")
      .content-block.padded-block.header-block.white-block
        markdown-renderer(:markdown-url="`${CDN}/${$route.meta.path}`")

</template>

<script>
import StaticPage from '@/mixins/StaticPage'

export default {
  name: 'page',
  mixins: [ StaticPage ],
  data() {
    return {
      editableContent: {
        pages: [
          {
            title: this.$route.meta.title,
            path: this.$route.meta.path
          }
        ]
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/buttons'
</style>
