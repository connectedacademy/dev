<template lang="pug">

  #info-modal(v-bind:class="{ visible: infoModalVisible }")
    #info-modal--header
      h1 {{ infoModalTitle }}
    #info-modal--container
      p {{ infoModalBody }}

      button.pure-button.pure-button-primary(v-on:click="closeModal")
        | {{ infoModalAction ? infoModalAction : $t('common.confirm') }}
    
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'info-modal',
  computed: {
    ...mapGetters(['infoModalVisible', 'infoModalTitle', 'infoModalBody', 'infoModalAction']),
  },
  methods: {
    closeModal() {
      this.$store.commit('DISMISS_INFO_MODAL');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

#info-modal
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
  #info-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      reset()
      color white
      font-size 1.2em
  #info-modal--container
    radius(12px)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0

</style>
