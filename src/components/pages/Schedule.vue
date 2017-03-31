<template lang="pug">

	.main-page

		.col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")
			.container
				h1.text-white Schedule
				.pure-button.pure-button-primary View Schedule


</template>

<script>
export default {
  name: 'schedule',
  data() {
    return {
      navTitle: 'Schedule - Connected Academy',
    };
  },
  components: { },
  methods: { },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

@import "../../assets/stylus/layout/page"

</style>
