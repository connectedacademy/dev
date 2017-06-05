<template lang="pug">

  .navigation.clearfix(v-bind:class="{ registered: isRegistered, hidden: hidden, minimized: navigation.minimized }" @click="scrollTop")

    router-link.navigation-item.navigation-item-brand(to="/") {{ navTitle }}

    //-
      #debug-button(@click="toggleDebugMode")
        icon(name="wrench")

    profile-icon(v-if="isRegistered")

    #login-button.pure-button.pure-button-primary(v-if="!isRegistered" @click="showAuth") {{ $t('auth.login') }}

</template>

<script>
import {mapGetters} from 'vuex';

import * as types from '@/store/mutation-types';
import ProfileIcon from './ProfileIcon';
import Auth from '@/mixins/Auth';

export default {
  name: 'navigation',
  mixins: [
    Auth,
  ],
  components: {
    ProfileIcon,
  },
  data() {
    return {
      isMinimized: false,
    };
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

@import "../../assets/stylus/shared/*";

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
    nomargin()
    nopadding()
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
  &:hover
    //background-color white
    //color $color-purple
    border-color white

.navigation
  animate()
  background-color $navigation-background-color
  box-sizing border-box
  height 60px
  padding 0
  position fixed
  top 0
  text-align center
  z-index 2
  width 100%
  &.hidden
    display none

  .navigation-item-brand
    animate()
    display block
    color white
    font-weight bold
    font-size 1.1em
    line-height 60px
    min-height 30px
    margin 0 auto
    padding 0 15px
    text-decoration none

  ul.navigation-items
    cleanlist()
    background-color darken($navigation-background-color, 10%)
    display block
    margin 0 auto
    padding 0 15px
    max-width calc(800px - 30px)
    text-align left
    li.navigation-item
      cleanlist()
      border-bottom transparent 2px solid
      color $navigation-text-color
      display inline-block
      font-size 0.9em
      line-height 58px
      padding 0 15px
      list-style none
      transition all 0.2s 0.05s linear
      &:hover
        cursor pointer
        &.navigation-item-page
          border-bottom white 2px solid

@media(max-width: 768px)
  ul.navigation-items
    text-align center
    li.navigation-item.navigation-item-brand
      display none

  &.minimized
    background-color alpha($navigation-background-color, 90%)
    /*height 30px*/
    /*top -60px*/
    .navigation-item-brand
      /*font-size 0.9em*/
      /*line-height 30px*/
/* App states */

#app.authenticating
  .navigation
    display none
</style>
