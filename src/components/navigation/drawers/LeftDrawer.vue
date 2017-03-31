<template lang="pug">

	.content-overlay(v-bind:class="{ visible: state.visible }" v-on:click="toggleLeftDrawer()")
		.drawer.drawer-left
			.brand-logo
				p connected
				p academy

			ul.drawer-list

				router-link.drawer-list-item(tag="li" to="/" v-bind:class="{ visible: state.visible }")
					h1.drawer-list-item--header Week One
					h2.drawer-list-item--body Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

				router-link.drawer-list-item(tag="li" to="/" v-bind:class="{ visible: state.visible }")
					h1.drawer-list-item--header Week Two
					h2.drawer-list-item--body Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

				router-link.drawer-list-item(tag="li" to="/" v-bind:class="{ visible: state.visible }")
					h1.drawer-list-item--header Week Three
					h2.drawer-list-item--body Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

			ul.drawer--footer
				router-link(tag="li" to="/") {{ $t('nav.home') }}
				router-link(tag="li" to="/about") {{ $t('nav.about') }}
				router-link(tag="li" to="/terms") {{ $t('nav.terms') }}

</template>

<script>

	export default {
	  name: 'left-drawer',
	  methods: {
	    toggleLeftDrawer() {
	      this.$store.commit('toggleLeftDrawer');
	    },
	  },
	  computed: {
	    state() {
	      return this.$store.state.navigation.leftDrawer;
	    },
	  },
	};

</script>

<style lang="stylus" scoped>

@import "../../../assets/stylus/shared/*"

	.content-overlay
		background-color rgba(0, 0, 0, 0)
		pointer-events none
		position fixed
		top 0
		bottom 0
		left 0
		right 0
		z-index 99
		transition background-color 0.6s

		.drawer
			background-color $color-dark-grey
			overflow scroll
			padding-bottom 60px
			position fixed

			ul.drawer--footer
				nomargin()
				nopadding()
				background-color $color-dark-grey
				border-top $color-darkest-grey 1px solid
				text-align center
				width 100%
				li
					color $color-grey
					display inline-block
					margin 0
					padding 20px

			&.drawer-left
				position fixed
				top 0
				bottom 0
				left -320px
				z-index 100
				max-width 320px
				width calc(100% - 60px)
				transition left 0.4s

			ul.navigation-items
				list-style none
				margin 0
				padding 0

				li.navigation-item
					list-style none
					margin 0
					padding 0
					color white

			/* Brand Logo */
			.brand-logo
				padding 15px 25px
				p
					nomargin()
					nopadding()
					color $color-grey
					font-size 1em
					font-weight normal
					line-height 15px
					&:last-child
						padding-left 30px

			/* Drawer List */
			ul.drawer-list
				list-style none
				margin 0
				padding 0
				li.drawer-list-item
					background-color alpha(white, 0)
					opacity 0
					list-style none
					margin 0
					padding 25px 60px 25px 25px
					position relative
					transition background-color 0.6s, left 0.6s, opacity 0.6s

					for num in (1..5)
						&:nth-child({num}n)
							left (num * -100px)

					h1
						color white
						margin 0
						padding 0
						font-size 1.6em

					h2
						color grey
						margin 0
						padding 0
						font-size 1em
						font-weight normal

					&.visible
						left 0
						opacity 1

					&:hover
						cursor pointer
						background-color alpha(white, 0.025)

		&.visible
			background-color rgba(0, 0, 0, 0.5)
			pointer-events all
			.drawer.drawer-left
				left 0px
				
</style>
