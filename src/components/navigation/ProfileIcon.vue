<template lang="pug">

  .profile-icon.animated.bounceIn(v-on:click="showProfile")
    .profile-image(v-bind:style="{ 'background-image': profile }")

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'profile-icon',
  data() {
    return {
      stateClose: false,
    };
  },
  computed: {
    ...mapGetters([
      'isRegistered',
    ]),
    profile() {
      return `url('${this.$store.state.auth.user.profile}')`;
    },
  },
  methods: {
    showProfile() {
      if (!this.isRegistered) {
        this.$ga.event('login-button', 'click', 'login-button-clicked', true);
        this.$store.commit(types.SHOW_AUTH);
      } else {
        this.$ga.event('profile-button', 'click', 'profile-viewed', true);
        this.$store.commit(types.TOGGLE_RIGHT_DRAWER);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.profile-icon
  position absolute
  top 0
  right 0
  padding 7px
  transition right 0.6s
  z-index 52

  .profile-image
    radius(50%)
    background-image()
    background-color white
    height 46px
    width 46px

    &:hover
      cursor pointer

</style>
