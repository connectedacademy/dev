<template lang="pug">

  #demo-modal(v-bind:class="{ visible: demoModalVisible }")
    #demo-modal--header
      h1 {{ $t('demo.unavailable_title') }}
    #demo-modal--container
      p {{ $t('demo.unavailable_description') }}

      button.pure-button.pure-button-primary(v-on:click="closeModal")
        | {{ $t('common.confirm') }}
    
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'demo-modal',
  computed: {
    ...mapGetters(['demoModalVisible']),
  },
  methods: {
    closeModal() {
      this.$store.commit('DISMISS_DEMO_MODAL');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#demo-modal
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
  #demo-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      reset()
      color white
      font-size 1.2em
  #demo-modal--container
    radius(12px)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0

</style>
