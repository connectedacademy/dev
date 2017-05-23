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
        this.$store.commit(types.SHOW_AUTH);
      } else {
        this.$store.commit(types.TOGGLE_RIGHT_DRAWER);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

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
