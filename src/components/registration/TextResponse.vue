<template lang="pug">

  fieldset.pure-group
    label {{ label }}
    textarea-autosize.full-width(ref="textarea" @change="updateValue" name="composer-textarea" v-bind:placeholder="placeholder" rows="1" v-model="value" v-bind:min-height="10" v-bind:max-height="200")
</template>

<script>

  import VueTextareaAutosize from 'vue-textarea-autosize';

  export default {
    name: 'text-response',
    props: ['label', 'placeholder', 'value'],
    components: {
      VueTextareaAutosize,
    },
    methods: {
      updateValue(value) {
        var formattedValue = value;
        if (formattedValue !== value) {
          this.$refs.textarea.value = formattedValue
        }
        this.$emit('input', formattedValue)
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

</style>
