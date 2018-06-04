<template lang="pug">

  .transcript

    h1(v-if="transcript" v-html="transcript")
    h1(v-else) ...

</template>

<script>
export default {
  name: 'transcript',
  props: ['transcript']
}
</script>

<style lang="stylus" scoped>

.transcript
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
