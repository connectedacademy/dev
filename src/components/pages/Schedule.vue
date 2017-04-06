<template lang="pug">

  .col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")
    .container
      h1.text-white Schedule
      .pure-button.pure-button-primary View Schedule

      .debug-wrapper(v-if="this.$store.state.navigation.debug")
        .content-block.white-block
          pre(v-if="course") {{ course }}

</template>

<script>
export default {
  name: 'schedule',
  data() {
    return {
      navTitle: 'Schedule - Connected Academy',
    };
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

	@import "../../assets/stylus/layout/page"

</style>
