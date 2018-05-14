<template lang="pug">

  .markdown-link
    router-link.pure-button.pure-button-white(v-bind:name="`${mdContent.slug}-markdown-link`" v-bind:to="{ name: 'markdown', params: { url: markdownUrl }}")
      | {{ $t('common.explore_content') }}

</template>

<script>

export default {
  name: 'markdown-link',
  props: ['mdContent'],
  computed: {
    markdownUrl() {
      return `${encodeURIComponent(this.mdContent.url)}`
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.markdown-link
  .pure-button
    min-width 120px
    max-width 200px

</style>
