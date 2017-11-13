<template lang="pug">

  #navigation(v-bind:class="{ registered: isRegistered, hidden: hidden, minimized: navigation.minimized }")

    #logo-text(@click="goHome") {{ $app.name }}

    #debug-button(v-if="showDebugToggle" @click="toggleDebugMode")
      icon(name="wrench")

    profile-icon(v-if="isRegistered")

    #login-button(v-if="!isRegistered" name="nav-login-button" @click="showAuth")
      | Login

</template>

<script>
import {mapGetters} from 'vuex';

import * as types from '@/store/mutation-types';
import ProfileIcon from './ProfileIcon';
import Auth from '@/mixins/Auth';

import 'vue-awesome/icons/wrench';
import 'vue-awesome/icons/user';

export default {
  name: 'navigation',
  mixins: [
    Auth,
  ],
  components: {
    ProfileIcon
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'navigation'
    ]),
    isRegistering() {
      return this.$route.name === 'registration';
    },
    hidden() {
      return !this.$store.state.navigation.visible;
    },
    showDebugToggle() {
      return this.$route.query.debug;
    },
  },
  methods: {
    toggleDebugMode() {
      this.$store.commit(types.TOGGLE_DEBUG_MODE);
    },
    goHome() {
      this.$router.push({ name: 'course' });
      this.$store.commit('PAUSE_MEDIA');
      setTimeout(() => {
        window.scroll(0, 0);
      }, 500);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#debug-button
  radius(50%)
  background-color red
  height 40px
  width 40px
  position fixed
  bottom 10px
  left 10px
  z-index 100
  .fa-icon
    reset()
    color white
    height 20px
    width 20px
    margin 10px

#login-button
  animate()
  color white
  height $navigation-height
  line-height $navigation-height
  padding 0 15px
  position absolute
  top 0
  right 0
  z-index 52
  .fa-icon
    height $navigation-height - -14px 20px
    margin 10px auto
  &:hover
    background-color alpha(black, 0.1)
    cursor pointer

#navigation
  animate()
  background-color $color-primary
  border-bottom alpha(black, 0.1) 1px solid
  height 50px
  position fixed
  top 0
  text-align center
  z-index 2
  width 100%
  &.hidden
    display none
  &:hover
    cursor pointer

  #logo-text
    color white
    font-size 1em
    font-weight bold
    line-height $navigation-height
    margin 0 10px

/* App states */

html
  &.registration
    #navigation
      display none
</style>
