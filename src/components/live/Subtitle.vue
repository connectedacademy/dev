<template lang="pug">

  .subtitle

    h1(v-if="subtitle" v-html="subtitle")
    h1(v-else) ...

</template>

<script>
export default {
  name: 'subtitle',
  props: ['subtitle']
}
</script>

<style lang="stylus" scoped>

.subtitle
  padding 15px 20px
  h1
    reset()
    color #444
    font-family 'Avenir', Helvetica, Arial, sans-serif
    font-size 1.1em
    font-weight normal
    font-weight bold
    @media(max-width: 600px)
      text-align center
</style>
