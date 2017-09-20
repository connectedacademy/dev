<template lang="pug">

  .navigation.clearfix(v-bind:class="{ registered: isRegistered, hidden: hidden, minimized: navigation.minimized }")

    animated-logo( @click="scrollTop")

    #debug-button(v-if="showDebugToggle" @click="toggleDebugMode")
      icon(name="wrench")

    profile-icon(v-if="isRegistered")

    #login-button.pure-button.pure-button-primary(v-if="!isRegistered" @click="showAuth") {{ $t('auth.login') }}

</template>

<script>
import {mapGetters} from 'vuex';

import * as types from '@/store/mutation-types';
import AnimatedLogo from '@/components/AnimatedLogo';
import ProfileIcon from './ProfileIcon';
import Auth from '@/mixins/Auth';

import 'vue-awesome/icons/wrench';

export default {
  name: 'navigation',
  mixins: [
    Auth,
  ],
  components: {
    AnimatedLogo,
    ProfileIcon,
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'navigation',
    ]),
    hidden() {
      return !this.$store.state.navigation.visible;
    },
    navTitle() {
      return (this.$store.getters.currentClass && this.$store.getters.currentClass.title && this.navigation.minimized) ? `${this.$store.getters.currentClass.title}` : 'Connected Academy';
    },
    showDebugToggle() {
      return this.$route.query.debug;
    },
  },
  methods: {
    toggleDebugMode() {
      this.$store.commit(types.TOGGLE_DEBUG_MODE);
    },
    scrollTop() {
      window.scroll(0, 0);
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
  background-color transparent
  border transparent 1px solid
  color white
  position fixed
  top 0
  right 0
  margin 10px
  z-index 56
  &:hover
    //background-color white
    //color $color-purple
    border-color white

.navigation
  animate()
  background-color $navigation-background-color
  box-sizing()
  height 60px
  padding 0
  position fixed
  top 0
  text-align center
  z-index 2
  width 100%
  &.hidden
    display none

/* App states */

#app.authenticating
  .navigation
    display none
</style>
