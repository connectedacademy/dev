<template lang="pug">
  
  .registration-page.schedule-step

    .content-block.white-block

      previous-button(v-on:previousStep="$emit('previousStep')")

      h3 Live Discussion Schedule

      p The next live discussion will take place at the following times. Pick one that suits you to be notified just before the class starts.

      liveclass-selector

      .pure-button.pure-button-info.rounded-short(v-bind:disabled="!formIsValid" @click="$emit('attemptRegistration')") {{ $t('auth.attempt_registration') }}
      
      .clearfix

</template>

<script>
import PreviousButton from '@/components/registration/PreviousButton'
import LiveclassSelector from '@/components/LiveclassSelector'

export default {
  name: 'schedule-step',
  props: ['response', 'formIsValid'],
  components: {
    PreviousButton,
    LiveclassSelector
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

.registration-page.schedule-step
  margin 0 auto
  max-width 800px
  position relative
  text-align center

</style>
