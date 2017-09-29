<template lang="pug">

  #question-modal(v-bind:class="{ visible: questionModalVisible }")
    #question-modal--header
      h1 {{ questionModal.title }}
    #question-modal--container
      p {{ questionModal.body }}

      button.pure-button.pure-button-primary(v-on:click="closeModal")
        | {{ questionModal.action ? questionModal.action : $t('common.confirm') }}
    
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'question-modal',
  computed: {
    ...mapGetters(['questionModal', 'questionModalVisible']),
  },
  methods: {
    closeModal() {
      this.$store.commit('DISMISS_QUESTION_MODAL');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

#question-modal
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
  #question-modal--header
    height 40px
    line-height 40px
    text-align center
    h1
      reset()
      color white
      font-size 1.2em
  #question-modal--container
    radius(12px)
    background-color white
    padding 20px 30px
    text-align center
    p
      margin 0 0 20px 0

</style>
