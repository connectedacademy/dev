<template lang="pug">

	.col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")
		.container
			h1.text-white Course
			.pure-button.pure-button-primary(@click="toggleColumnState") View Course

</template>

<script>

  export default {
    name: 'course',
    created() {
      this.$store.dispatch('setColumnState', 'wide');
    },
    data() {
      return {
        navTitle: 'Course - Connected Academy',
      };
    },
    components: { },
    methods: {
      toggleColumnState() {
        this.$store.dispatch('toggleColumnState');
      },
    },
  };

</script>

<style lang="stylus" scoped>

	@import "../../assets/stylus/layout/page"

</style>
