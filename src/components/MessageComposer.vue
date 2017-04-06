<template lang="pug">

	.message-composer-wrapper

		.message-composer(v-bind:class="{ active: visible, hidden: this.$store.state.navigation.leftDrawer.visible }")

			.message-composer--header(v-on:click="visible = !visible")

				p.action-label {{ visible ? $t('composer.compose_message_active') : $t('composer.compose_message') }}

				p.position-label
					| {{ $t('composer.duration', { scrollPosition: scrollPosition }) }}

			.message-composer--body
				textarea(name="name" rows="3" v-bind:placeholder="$t('composer.message_placeholder')")

		.content-overlay(v-bind:class="{ visible: (visible && !this.$store.state.navigation.leftDrawer.visible) }" v-on:click="dismissComposer")

</template>

<script>
export default {
  name: 'message-composer',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    dismissComposer() {
      this.visible = false;
    },
  },
  computed: {
    scrollPosition() {
      return this.$store.getters.scrollPosition;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*"

	.message-composer-wrapper

		/* Default State */

		.message-composer
			background-color white
			border-radius 6px
			box-sizing border-box

			position fixed
			bottom -110px
			left 50%
			margin-left calc(-370px / 2)
			overflow hidden
			z-index 101

			height 160px
			width 370px

			transition bottom 0.6s, margin-left 0.6s, margin-bottom 0.6s, width 0.6s

			@media(max-width: 400px)
				margin-left calc(-50% + 15px)
				width calc(100% - 30px)

				transition bottom 0.4s, margin-left 0.4s, margin-bottom 0.4s, width 0.4s

			&:hover
				cursor pointer
				bottom -105px

			.message-composer--header
				height 50px

				p
					margin 0
					padding 0 15px

					line-height 50px

					&.action-label
						float left

					&.position-label
						float right

			.message-composer--body
				background-color #f9f9f9
				height 120px

				textarea
					background-color #f9f9f9
					border none
					font-size 1em

					box-sizing border-box
					padding 15px
					height 110px
					width 100%


		.content-overlay
			background-color rgba(0, 0, 0, 0)

			pointer-events none

			position fixed
			top 0
			bottom 0
			left 0
			right 0
			z-index 100

			transition background-color 0.4s

		/* Active State */

		.message-composer.active, .message-composer.active:hover
			bottom 50%
			margin-bottom calc(-160px / 2)
			margin-left calc(-400px / 2)
			width 400px
			@media(max-width: 400px)
				bottom 0
				border-radius 0
				margin-left -50%
				margin-bottom 0
				width 100%

		.content-overlay.visible
			background-color rgba(0, 0, 0, 0.8)
			pointer-events all

		/* Hidden State */

		.message-composer.hidden, .message-composer.hidden:hover
			bottom -160px


</style>
