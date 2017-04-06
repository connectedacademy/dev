<template lang="pug">

  .video-container
    iframe(v-bind:src="src" frameborder="0" allowfullscreen)
    button.pure-button(v-on:click="loadVideoById('bHQqvYy5KYo', 5, 'large')") Load Video

</template>

<script>
export default {
  name: 'video-container',
  props: ['videoSrc'],
  data() {
    return {
      msg: 'Welcome to Connected Academy',
    };
  },
  computed: {
    src() {
      return `http://www.youtube.com/embed/${this.videoSrc}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*"

	.video-container
		background-color alpha(white, 0.025)
		box-sizing border-box
		height 0
		overflow hidden
		padding 0
		padding-bottom 56.25%
		position relative
		width 100%

		.play-icon
			display none
			color white
			position absolute
			left 50%
			top 50%
			transform scale(2) translate(-50%, -50%)

		iframe, object, embed
			position absolute
			top 0
			left 0
			width 100%
			height 100%

</style>
