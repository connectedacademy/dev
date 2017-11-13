<template lang="pug">

  fieldset.pure-group
    label {{ label }}
    textarea-autosize.full-width(ref="textarea" v-bind:value="currentValue" @input="updateValue" name="composer-textarea" v-bind:placeholder="placeholder" rows="1" v-bind:min-height="10" v-bind:max-height="200")
</template>

<script>

  import VueTextareaAutosize from 'vue-textarea-autosize';

  export default {
    name: 'text-response',
    props: ['label', 'placeholder', 'value'],
    components: { VueTextareaAutosize },
    mounted() {
      this.updateValue(this.value ? this.value : '')
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    methods: {
      updateValue(value) {
        this.currentValue = value
        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

</style>
