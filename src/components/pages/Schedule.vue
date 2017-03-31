<template lang="pug">

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

<style lang="stylus" scoped>

	@import "../../assets/stylus/layout/page"

</style>
