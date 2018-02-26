<template lang="pug">

  .markdown-link
    router-link.pure-button(v-bind:name="`${mdContent.slug}-markdown-link`" v-bind:to="{ name: 'markdown', params: { url: markdownUrl }}")
      | {{ $t('common.explore_content') }}
      i.fas.fa-angle-right

</template>

<script>

export default {
  name: 'markdown-link',
  props: ['mdContent'],
  computed: {
    markdownUrl() {
      return encodeURIComponent(`${this.$store.getters.currentClass.dir}/${this.mdContent.url}`)
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.angle-icon
  top 3px
  position relative
  margin-left 7px

</style>
