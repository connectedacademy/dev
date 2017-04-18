<template lang="pug">

  .drawer.drawer-left(v-bind:class="{ visible: state.visible }")

    .brand-logo
      p connected
      p academy

    ul.drawer-list

      li.drawer-list-item(v-for="(currentClass, index) in classes" v-bind:key="currentClass.name" v-bind:class="{ visible: state.visible }" v-on:click="setCurrentClass(index)")
        h1.drawer-list-item--header {{ currentClass.name }}
        h2.drawer-list-item--body {{ currentClass.description }}

      li.drawer-list-item(v-on:click="toggleDebugMode" v-bind:class="{ visible: state.visible }")
        h2.drawer-list-item--body
          span(v-if="!this.$store.state.navigation.debug") {{ $t('common.enable_debug_mode') }}
          span(v-if="this.$store.state.navigation.debug") {{ $t('common.disable_debug_mode') }}

    ul.drawer--footer
      router-link(tag="li" to="/") {{ $t('nav.home') }}
      router-link(tag="li" to="/about") {{ $t('nav.about') }}
      router-link(tag="li" to="/terms") {{ $t('nav.terms') }}

</template>

<script>
import * as types from '../../../store/mutation-types';

export default {
  name: 'left-drawer',
  methods: {
    toggleLeftDrawer() {
      this.$store.commit(types.TOGGLE_LEFT_DRAWER);
    },
    toggleDebugMode() {
      this.$store.commit(types.TOGGLE_DEBUG_MODE);
    },
    setCurrentClass(newClass) {
      this.$store.commit(types.TOGGLE_LEFT_DRAWER);
      this.$store.commit(types.SET_CURRENT_CLASS, newClass);
    },
  },
  computed: {
    classes() {
      return this.$store.getters.course.classes;
    },
    state() {
      return this.$store.state.navigation.leftDrawer;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../../assets/stylus/shared/*";

.drawer-left
  position fixed
  top 0
  bottom 0
  left -320px
  max-width 320px
  width calc(100% - 60px)
  transition left 0.4s
  &.visible
    left 0px

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

</style>
