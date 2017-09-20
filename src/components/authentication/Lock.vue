<template lang="pug">  
#overlay-lock(v-if="locked")
  .overlay-lock--modal
    p Please enter the passcode you were given to continue
    input(v-model="enteredPasscode" type="text" placeholder="Enter Passcode" v-on:keyup.enter="attemptUnlock")
    .pure-button.pure-button--success(@click="attemptUnlock") Unlock
</template>

<script>
export default {
  name: 'lock',
  props: ['passcode'],
  data() {
    return {
      locked: true,
      enteredPasscode: undefined,
    }
  },
  created() {
    if (window.location.hostname === 'localhost') {
      this.locked = false;
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
    radius(10px)
    background-color white
    padding 30px
    position absolute
    left 50%
    top 50px
    margin-left -150px
    text-align center
    width 240px
    .fa-icon
      reset()
      color $color-light-grey
      height 40px
    p
      color $color-text-grey
    input
      font-size 1.2em
      margin 10px auto 30px auto
      outline 0
      padding 10px 0
      text-align center
</style>
