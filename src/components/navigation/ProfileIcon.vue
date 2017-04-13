<template lang="pug">


	.profile-icon.animated.bounceIn
		.profile-image(v-bind:style="{ 'background-image': profile }")


</template>

<script>
export default {
  name: 'profile-icon',
  data() {
    return {
      stateClose: false,
    };
  },
  computed: {
    profile() {
      return `url('${this.$store.state.auth.user.profile}')`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*"

.profile-icon
  position absolute
  top 0
  right 0
  padding 10px
  transition right 0.6s
  .profile-image
    background-color white
    background-size cover
    background-repeat no-repeat
    background-position center
    border-radius 50%
    height 40px
    width 40px

    &:hover
      cursor pointer

</style>
