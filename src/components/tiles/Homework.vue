<template lang="pug">
.content-item.homework-item(v-if="$route.name === 'content'")
  .content
    h1 #[i.fas.fa-star]{{ content.title }}
    p {{ content.description }}
  router-link.pure-button.pure-button-transparent.no-margin(v-bind:to="{ name: 'feedback', params: { classSlug: $store.getters.currentClass.slug, contentSlug: content.slug } }")
    | {{ $t('common.participate') }}
  .clearfix
</template>

<script>
export default {
  name: 'homework',
  props: ['content']
}
</script>

<style lang="stylus" scoped>

@import '~stylus/action-tile'

</style>