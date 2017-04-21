<template lang="pug">

ul.hub-selector
  li.hub Test 1
  li.hub Test 2
  li.hub Test 3

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

ul.hub-selector
  cleanlist()
  li.hub
    cleanlist()
    background-color red
    height 100px
    width 100px

</style>
