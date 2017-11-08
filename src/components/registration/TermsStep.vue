<template lang="pug">
  
  .registration-page

    .content-block.white-block

      info-dialogue
        p {{ $t('auth.read_the_following') }}

      #terms-markdown(v-html="termsMarkdown")

      label.pure-checkbox(for="consent-cb")
        input#consent-cb(type="checkbox" v-model="response.consent")
        | {{ $t('auth.i_agree_to_terms_and_conditions') }}

      .pure-button.pure-button-primary(v-bind:disabled="!formIsValid || !response.consent" @click="attemptRegistration") {{ $t('auth.attempt_registration') }}
      
      .clearfix

</template>

<script>
import MarkdownRenderer from '@/components/MarkdownRenderer';
import MarkdownIt from 'markdown-it';

export default {
  name: 'terms-step',
  props: ['response', 'formIsValid'],
  components: {
    MarkdownRenderer,
    MarkdownIt
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/forms'

#terms-markdown
  radius(4px)
  border $color-border 1px solid
  max-height 340px
  margin 20px auto
  min-height 200px
  padding 5px 15px
  overflow-y auto
  overflow-x none

</style>
