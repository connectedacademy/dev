<template lang="pug">

  .profile-icon(v-if="!isRegistering" @click="showProfile")
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
    isRegistering() {
      return this.$route.name === 'registration';
    },
  },
  methods: {
    showProfile() {
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
  top 7px
  right 7px
  z-index 53
  &:hover
    cursor pointer
  .profile-image
    radius(50%)
    background-image()
    background-color alpha(black, 0.1)
    height 36px
    width 36px

</style>
