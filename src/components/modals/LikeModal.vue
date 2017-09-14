<template lang="pug">

  .like-modal(v-bind:class="{ visible: visible }")
    .like-modal--header
      h1 {{ $t('like.like_content') }}
    .like-modal--container
      p When you like course material on connected academy we post a tweet with the link to that content through your twitter account.

      button.pure-button.pure-button-primary(v-on:click="likeContent")
        | {{ $t('like.confirm_like') }}

</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'like-modal',
  props: ['content', 'visible'],
  watch: {
    likeModalVisible(nV) {
      if (!nV) {
        this.$emit('hide');
      }
    }
  },
  computed: {
    ...mapGetters(['likeModalVisible']),
  },
  methods: {
    likeContent() {
      this.$log.info('Content liked');
      this.$emit('hide');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.like-modal
  animate()
  display block
  max-width 320px
  position fixed
  z-index 57
  top 120px
  left 50%
  margin-left -160px
  opacity 0
  pointer-events none
  &.visible
    top 80px
    opacity 1
    pointer-events all
  .like-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      reset()
      color white
      font-size 1.2em
  .like-modal--container
    radius(12px)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0

</style>
