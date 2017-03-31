<template lang="pug">

	.video-container
		iframe(src="http://www.youtube.com/embed/T5YOZbzJ-ko" frameborder="0" allowfullscreen)

</template>

<script>
	export default {
	  name: 'video-container',
	  data() {
	    return {
	      msg: 'Welcome to Connected Academy',
	    };
	  },
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
