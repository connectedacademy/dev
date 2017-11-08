<template lang="pug">

transition(name="slide-left")
  .drawer#drawer-left(name="left-drawer" v-if="isVisible")

    .card

      ul.drawer-list

        li.drawer-list-item(name="course-drawer-item" @click="navigateTo('/')")
          h1.drawer-list-item--header {{ $t('nav.take_part') }}
          h2.drawer-list-item--body {{ $t('nav.take_part_description') }}

        li.drawer-list-item(name="schedule-drawer-item" @click="navigateTo('/schedule')")
          h1.drawer-list-item--header {{ $t('nav.schedule') }}
          h2.drawer-list-item--body {{ $t('nav.schedule_description') }}

        li.drawer-list-item(name="about-drawer-item" @click="navigateTo('/about')")
          h1.drawer-list-item--header {{ $t('nav.about') }}
          h2.drawer-list-item--body {{ $t('nav.about_description') }}

    #app-version V{{ $app.version }}

</template>

<script>
export default {
  name: 'left-drawer',
  methods: {
    navigateTo(toLink) {
      this.toggleLeftDrawer();
      this.$router.push(toLink);
    },
    toggleLeftDrawer() {
      this.$store.commit('TOGGLE_LEFT_DRAWER');
    },
  },
  computed: {
    isVisible() {
      return this.$store.state.navigation.leftDrawer.visible;
    },
  },
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
  