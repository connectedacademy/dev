<template lang="pug">

  .subtitle
    h1(v-html="subtitle")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';

export default {
  name: 'subtitle',
  props: ['subtitle'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.subtitle
  padding 15px 20px
  h1
    reset()
    color $color-text-grey
    font-family 'Avenir', Helvetica, Arial, sans-serif
    font-size 1.1em
    font-weight normal
    @media(max-width: 600px)
      text-align center
</style>
