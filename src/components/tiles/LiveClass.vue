<template lang="pug">
.content-item.liveclass-item(v-if="$route.name === 'content'" v-bind:class="{ independent: independent }")
  .content
    h1 #[i.fab.fa-twitter]{{ content.title }}
    p This class has a live twitter based discussion, click below to join it.
  router-link.pure-button.pure-button-transparent.no-margin(v-bind:to="{ name: 'live' }")
    | Join Class
  .clearfix
</template>

<script>
export default {
  name: 'live-class',
  props: ['content', 'independent']
}
</script>

<style lang="stylus" scoped>

@import '~stylus/action-tile'

.content-item
  &.independent
    margin-top 20px !important
    padding 15px
    .pure-button
      box-sizing()
      max-width none
      width 100%
</style>
