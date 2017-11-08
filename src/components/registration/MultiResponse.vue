<template lang="pug">

  fieldset.pure-group
    label {{ label }}
    .pure-button.multi-option(v-for="(option, index) in options" @click="setSelectedOption(option)" v-bind:class="{ 'pure-button-dark': (value === option), 'pure-button-subtle': (value !== option) }") {{ option }}
    //- select.full-width(ref="select")
      option(v-for="(response_option, index) in options" value="response_option") {{ response_option }}

</template>

<script>
  export default {
    name: 'multi-response',
    props: ['label', 'value', 'options'],
    data() {
      return {
        selectedOption: undefined
      }
    },
    methods: {
      setSelectedOption(option) {
        this.selectedOption = option;
        this.$emit('input', option)
        setTimeout(() => {
          this.$emit('answered')
        }, 300)
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

fieldset.pure-group
  margin-bottom 0
  .multi-option
    margin 10px

</style>
