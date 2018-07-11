<!--<template lang="pug">
  .toggle-icon
    span(v-show="toggle")
      .primary(ref="primary")
    span(v-show="!toggle")
      i(:class="secondary")
</template>-->

<script>
import Vue from 'vue'
export default {
  name: 'toggle-icon',
  props: ['toggle', 'primary', 'secondary'],
  render: function (createElement) {
    console.log('this.toggle', this.toggle)
    if (this.toggle) {
      return createElement('div', {}, [
        createElement('span', {}, [
          createElement('i', {
            class: this.primary.split(',')
          })
        ])
      ])
    } else {
      return createElement('div', {}, [
        createElement('span', {}, [
          createElement('i', {
            class: this.secondary.split(',')
          })
        ])
      ])
    }
    // } else {
    //   return createElement('span', {}, [
    //     createElement('i', {
    //       class: this.secondary.split(',')
    //     })
    //   ])
    // }
    // return createElement('div', {}, [
    //   createElement('i', {
    //     class: this.primary
    //   }),
    //   createElement('i', {
    //     class: this.secondary
    //   })
    // ])
  }
  // mounted() {
  //   // create node
  //   console.log('createElement(h1)', Vue.createElement('h1'))
    
  // }
}
</script>

<style lang="stylus" scoped>

.toggle-icon
  background-color red
  height 50px
  width 50px

</style>
