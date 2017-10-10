<template lang="pug">

  .profile-icon(@click="showProfile")
    onboarding-prompt(identifier="profile-button" prompt="click for profile actions" top="55" left="-210" position="top-right" z-index="50")
    .profile-image(v-bind:style="{ 'background-image': profile }")

</template>

<script>
export default {
  name: 'profile-icon',
  computed: {
    profile() {
      return `url('${this.$store.state.auth.user.profile}')`;
    },
  },
  methods: {
    showProfile() {
      this.$cookie.delete('profile-button');
      this.$ga.event('profile-button', 'clicked', 1);
      this.$store.commit('TOGGLE_RIGHT_DRAWER');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.profile-icon
  position absolute
  top 9px
  right 7px
  transition right 0.6s
  z-index 53

  .profile-image
    radius(50%)
    background-image()
    background-color alpha(black, 0.1)
    height 42px
    width 42px

    &:hover
      cursor pointer

</style>
