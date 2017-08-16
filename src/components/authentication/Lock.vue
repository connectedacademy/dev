<template lang="pug">  
#overlay-lock(v-if="locked")
  .overlay-lock--modal
    icon(name="lock")
    p Please enter the passcode you were given to continue
    input(v-model="enteredPasscode" type="text" placeholder="Enter Passcode" v-on:keyup.enter="attemptUnlock")
    .pure-button.pure-button--success(@click="attemptUnlock") Unlock
</template>

<script>

import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'lock',
  props: ['passcode'],
  data() {
    return {
      locked: true,
      enteredPasscode: undefined,
    }
  },
  methods: {
    attemptUnlock() {
      if (parseInt(this.enteredPasscode) === parseInt(this.passcode)) {
        this.locked = false;
      } else {
        this.locked = true;
      }
    },
  }, 
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#overlay-lock
  pinned()
  background-color $color-primary
  position fixed
  z-index 999
  .overlay-lock--modal
    radius(20px)
    background-color white
    padding 30px
    position absolute
    left 50%
    top 50px
    margin-left -120px
    text-align center
    width 240px
    .fa-icon
      reset()
      color $color-primary
      height 50px
    p
      color $color-text-grey
    input
      font-size 1.4em
      margin 10px auto 30px auto
      outline 0
      padding 10px 0
      text-align center
</style>
