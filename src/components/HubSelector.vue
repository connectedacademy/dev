<template lang="pug">

ul.hub-selector
  li.hub(v-for="hub in hubs")
    h1.hub-name {{ hub.name }}
    h2.hub-timezone {{ hub.timezone }}
  .clearfix

</template>

<script>
export default {
  name: 'hub-selector',
  data() {
    return {};
  },
  computed: {
    course() {
      return this.$store.getters.course;
    },
    hubs() {
      return this.$store.getters.hubs;
    },
  },
  components: {},
  methods: {},
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

ul.hub-selector
  cleanlist()
  margin 10px -10px
  li.hub
    cleanlist()
    background-color $color-primary
    float left
    text-align center
    margin 10px
    padding 20px
    @media(max-width: 1600px)
      width calc((100% / 3) - 60px)
    @media(max-width: 768px)
      background-color red
      width calc((100% / 2) - 60px)
    h1.hub-name
      nomargin()
      nopadding()
      color white
      font-size 1.3em
    h2.hub-timezone
      nomargin()
      nopadding()
      color white
      font-size 1.1em

</style>
