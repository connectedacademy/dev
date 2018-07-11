<template lang="pug">

transition(name="fade")
  .onnboarding-prompt(v-if="visible" @click.prevent.stop="hidePrompt()" v-bind:style="promptStyles" v-bind:class="[position]")
    .prompt--line
    .prompt--spot
    span {{ prompt }}
    .dismiss-button
      icon(icon="check")

</template>

<script>

export default {
  name: 'onnboarding-prompt',
  props: ['identifier', 'prompt', 'top', 'left', 'position', 'zIndex'],
  mounted() {
    setTimeout(() => {
      this.visible = !this.$cookie.get(this.identifier);
    }, 1000)
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    promptStyles() {
      let styles = {
        'z-index': `${this.zIndex}`,
        left: `${this.left}px`,
        top: `${this.top}px`
      }
      return styles
    }
  },
  methods: {
    hidePrompt() {
      this.$cookie.set(this.identifier, 'hidden', 1)
      this.visible = false
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

$color-prompt = #1b6ff1

.onnboarding-prompt
  radius(6px)
  box-shadow()
  animate()
  background-color $color-prompt
  color white
  position absolute
  top 50px
  left -100px
  padding 10px 50px 10px 15px
  z-index 49
  text-transform uppercase
  font-weight bold
  font-size 0.8em
  white-space nowrap
  .dismiss-button
    pinned()
    border-left alpha(black, 0.2) 1px solid
    position absolute
    left auto
    height 38px
    width 44px

    > svg
      height 18px
      padding 10px
      width 24px
      position absolute
      top 0
      right 0
  .prompt--line
    content ''
    background-color $color-prompt
    position absolute
    height 10px
    width 4px
    margin-left -2px
    z-index inherit
  .prompt--spot
    radius(50%)
    content ''
    background-color $color-prompt
    height 12px
    width 12px
    position absolute
    margin-left -6px
    z-index inherit
  &.bottom-left
    .prompt--spot
      bottom -20px
      left 10px
    .prompt--line
      bottom -10px
      left 10px
  &.bottom-right
    .prompt--spot
      bottom -20px
      right 6px
    .prompt--line
      bottom -10px
      right 10px
  &.top-left
    .prompt--spot
      top -20px
      left 10px
    .prompt--line
      top -10px
      left 10px
  &.top-right
    .prompt--spot
      top -20px
      right 6px
    .prompt--line
      top -10px
      right 10px
  &:hover
    cursor pointer
    background-color darken($color-prompt, 10%)
    .prompt--spot, .prompt--line
      background-color darken($color-prompt, 10%)

</style>
