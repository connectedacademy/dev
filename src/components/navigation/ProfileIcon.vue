<template>
	<div class="profile-icon animated bounceIn">
		<div class="profile-image"></div>
	</div>
</template>

<script>
export default {
  name: 'profile-icon',
  data() {
    return {
      stateClose: false,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*"

	.profile-icon {
		position absolute
		top 0
		right 0

		padding 10px

		transition right 0.6s
		.profile-image {
			background-color white
			border-radius 50%

			height 40px
			width 40px
		}

		&:hover {
			cursor pointer
		}
	}
</style>
