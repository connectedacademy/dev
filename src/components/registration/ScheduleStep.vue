<template lang="pug">
  
  .registration-page.schedule-step

    .content-block.white-block

      previous-button(v-on:previousStep="$emit('previousStep')")

      h3 Live Discussion Schedule

      p The next live discussion will take place at the following times. Pick one that suits you to be notified just before the class starts.

      liveclass-selector(v-model="response.hub_id")

      .pure-button.pure-button-info.rounded-short(v-bind:disabled="!allowSubmission" @click="$emit('attemptRegistration')") {{ $t('auth.attempt_registration') }}
      
      .clearfix

</template>

<script>
import PreviousButton from '@/components/registration/PreviousButton'
import LiveclassSelector from '@/components/LiveclassSelector'

export default {
  name: 'schedule-step',
  props: ['response'],
  components: {
    PreviousButton,
    LiveclassSelector
  },
  computed: {
    allowSubmission() {
      return this.response.hub_id
    }
  },
  methods: {
    hubSelected(hub) {
      response.hub
    }
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
