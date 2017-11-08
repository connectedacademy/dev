<template lang="pug">

  fieldset.pure-group
    label {{ label }}
    .vue-slider-wrapper
      vue-slider(@callback="updateValue" v-model="currentValue" v-bind:tooltip="false" v-bind:min="0" v-bind:max="10" v-bind:bg-style="{ 'background-color': '#d9d9d9' }" v-bind:process-style="{ 'background-color': '#d9d9d9' }" v-bind:tooltip-style="{ 'background-color': '#0078E7', 'border-top-color': '#0078E7' }")
    .min.pull-left {{ min }}
    .max.pull-right {{ max }}
    .clearfix

</template>

<script>

  import VueSlider from 'vue-slider-component';

  export default {
    name: 'scale-response',
    props: ['label', 'min', 'max', 'value'],
    mounted() {
      this.updateValue(5)
    },
    data() {
      return {
        currentValue: this.value
      }
    },
    components: {
      VueSlider
    },
    methods: {
      updateValue(value) {
        this.currentValue = value
        this.$emit('input', Number(value))
      }
    }
  }
</script>

<style lang="stylus" scoped>

@import '~stylus/registration'

.vue-slider-wrapper
  padding 20px 10px

</style>
