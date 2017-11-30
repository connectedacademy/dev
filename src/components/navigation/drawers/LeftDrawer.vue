<template lang="pug">

transition(name="slide-left")
  .drawer#drawer-left(name="left-drawer" v-if="isVisible")

    .card

      ul.drawer-list

        //- router-link.drawer-list-item(tag="li" name="home-drawer-item" v-bind:to="{ name: 'home' }")
        //-   h1.drawer-list-item--header {{ $t('nav.home') }}
        //-   h2.drawer-list-item--body {{ $t('nav.home_description') }}

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
    ul.drawer-links
      li
        span {{ `${$app.version} - ${$app.built}` }}

</template>

<script>
export default {
  name: 'left-drawer',
  beforeRouteUpdate(to, from, next) {
    this.$store.commit('TOGGLE_LEFT_DRAWER')
  },
  computed: {
    isVisible() {
      return this.$store.state.navigation.leftDrawer.visible;
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

/* Brand Logo */
.brand-logo
  display block
  padding 15px 25px
  text-decoration none
  p
    reset()
    color white
    font-size 1em
    font-weight normal
    line-height 15px
    &:last-child
      padding-left 30px

</style>
  