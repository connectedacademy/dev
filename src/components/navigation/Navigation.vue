<template lang="pug">

  #navigation(v-bind:class="{ registered: isRegistered, visible: visible, minimized: navigation.minimized }")

    #logo-text(@click="goHome") {{ $app.name }}

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
    visible() {
      return this.$store.state.navigation.visible;
    }
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'schedule' });
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

#login-button
  animate()
  color white
  font-weight bold
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
  display none
  height 50px
  position fixed
  top 0
  text-align center
  z-index 2
  width 100%
  &.visible
    display block
  &:hover
    cursor pointer

  #logo-text
    color white
    font-size 1em
    font-weight bold
    line-height $navigation-height
    margin 0 10px

</style>
