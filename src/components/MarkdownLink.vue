<template lang="pug">

  .markdown-link
    router-link.pure-button(v-bind:name="`${mdContent.slug}-markdown-link`" v-bind:to="{ name: 'markdown', params: { url: markdownUrl }}")
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

</style>
