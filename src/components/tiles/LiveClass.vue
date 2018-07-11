<template lang="pug">
.content-item.liveclass-item(v-if="$route.name === 'content'" v-bind:class="{ independent: independent }")
  .content
    h1
      icon(:icon="['fab', 'twitter']" v-if="course.engine === 'twitter'" title="Messages are published on Twitter")
      icon(icon="comment")(v-if="course.engine === 'local'" title="Messages are stored on Connected Academy")
      | {{ content.title }}
    p {{ independent ? 'This class has a live twitter based discussion, click below to join it.' : content.description }}
  router-link.pure-button.pure-button-transparent.no-margin(v-bind:to="{ name: 'live' }")
    | Join Class
  .clearfix
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'live-class',
  props: ['content', 'independent'],
  computed: {
    ...mapGetters([
      'course'
    ])
  }
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
