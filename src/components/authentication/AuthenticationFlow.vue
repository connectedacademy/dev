<template lang="pug">

	.authentication-wrapper(v-bind:class="{ visible: this.$store.state.auth.visible }")
		.content-overlay
			.auth-modal.animated(v-bind:class="{ bounceIn: this.$store.state.auth.visible }")
				.auth-modal--header
					h1 {{ (this.$store.state.auth.authenticating) ? $t('auth.authenticating') : $t('auth.authenticate') }}
				.auth-modal--container
					form.pure-form.pure-form-stacked(v-on:submit.prevent="authenticate")
						fieldset
							label {{ $t('auth.form.your_name') }}
							input(type="text" v-bind:placeholder="$t('auth.form.name_placeholder')" v-bind:disabled="this.$store.state.auth.authenticating")
						fieldset
							label {{ $t('auth.form.your_organisation') }}
							input(type="text" v-bind:placeholder="$t('auth.form.organisation_placeholder')" v-bind:disabled="this.$store.state.auth.authenticating")
						fieldset
							label.pure-checkbox(for="cb")
								input#cb(type="checkbox" v-bind:disabled="this.$store.state.auth.authenticating")
								| {{ $t('auth.i_agree_to_terms_and_conditions') }}
						fieldset
							button.pure-button.pure-button-primary(v-on:click.once="authenticate" v-bind:disabled="this.$store.state.auth.authenticating")
								| {{ (this.$store.state.auth.authenticating) ? $t('auth.authenticating') : $t('auth.login_with_twitter') }}

</template>

<script>

	export default {
	  name: 'authentication-flow',
	  methods: {
	    authenticate() {
	      this.$store.commit('attemptAuth', {
	        name: 'Edward Jenkins',
	        organisation: 'Newcastle University',
	      });
	    },
	  },
	};

</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*"

	.authentication-wrapper
		pointer-events none
		opacity 0
		.content-overlay
			background-color transparent
			position fixed
			z-index 100
			pinned()
			.auth-modal
				animate()
				margin 40px auto
				opacity 0
				width 320px
				.auth-modal--header
					height 40px
					line-height 40px
					text-align center
					h1
						color white
						font-size 1.2em
				.auth-modal--container
					radius(12px)
					background-color white
					min-height 200px
					padding 20px 30px
					text-align center
					form
						text-align center
						fieldset
							text-align center
							label
								color $color-grey
								text-align left
							input
								text-align left
								width 100%
							input[type="checkbox"]
								margin-right 10px
								width auto

		&.visible
			display block
			opacity 1
			pointer-events all
			.content-overlay
				background-color $color-auth-background-color
				.auth-modal
					opacity 1

</style>
