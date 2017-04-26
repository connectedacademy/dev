<template lang="pug">

  .message.visible

    img(v-bind:src="message.author.profile")

    p
      strong {{ message.author.account }}

    p {{ ' ' + message.text }}

</template>

<script>
import _ from 'lodash';

export default {
  name: 'message',
  props: ['message'],
  computed: {
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.message
  margin 15px
  padding 5px 10px
  padding-left 50px

  position relative

  opacity 0

  transition opacity 1s

  img
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 5px
    left 0
  p
    nomargin()
    nopadding()
    color $color-text-dark-grey
  &.visible
    opacity 1

</style>
