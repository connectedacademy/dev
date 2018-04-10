<template lang="pug">

transition(name="slide-left")
  .drawer#drawer-left(name="left-drawer" v-if="isVisible")

    .brand-logo(v-bind:title="`${$app.version} - ${$app.built}`")
      p Connected Academy

    .card

      ul.drawer-list

        router-link.drawer-list-item(tag="li" name="home-drawer-item" v-bind:to="{ name: 'home' }")
          h1.drawer-list-item--header {{ $t('nav.home') }}
          h2.drawer-list-item--body {{ $t('nav.home_description') }}

        router-link.drawer-list-item(tag="li" name="schedule-drawer-item" v-bind:to="{ name: 'schedule' }")
          h1.drawer-list-item--header {{ $t('nav.schedule') }}
          h2.drawer-list-item--body {{ $t('nav.schedule_description') }}

        router-link.drawer-list-item(tag="li" name="about-drawer-item" v-bind:to="{ name: 'about' }")
          h1.drawer-list-item--header {{ $t('nav.about') }}
          h2.drawer-list-item--body {{ $t('nav.about_description') }}

        router-link.drawer-list-item(tag="li" name="faq-drawer-item" v-bind:to="{ name: 'faq' }")
          h1.drawer-list-item--header {{ $t('nav.faq') }}
          h2.drawer-list-item--body {{ $t('nav.faq_description') }}

        //- router-link.drawer-list-item(tag="li" name="terms-drawer-item" to="terms")
        //-   h1.drawer-list-item--header {{ $t('nav.terms') }}
        //-   h2.drawer-list-item--body {{ $t('nav.terms_description') }}

    ul.drawer-links
      li
        router-link(v-bind:to="{ name: 'terms' }") Terms & Conditions

</template>

<script>
export default {
  name: 'left-drawer',
  beforeRouteUpdate(to, from, next) {
    this.dismissDrawer()
  },
  computed: {
    isVisible() {
      return this.$store.state.navigation.leftDrawer.visible;
    }
  },
  methods: {
    dismissDrawer () {
      this.$store.commit('TOGGLE_LEFT_DRAWER')
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

/* Brand Logo */
.brand-logo
  background-color alpha(black, 0.05)
  display block
  padding 0 25px
  text-decoration none
  p
    reset()
    color white
    font-size 1em
    font-weight bold
    line-height $navigation-height
    opacity 0.3

</style>
  