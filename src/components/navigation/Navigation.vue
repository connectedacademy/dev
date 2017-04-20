<template lang="pug">


  .navigation.clearfix(v-bind:class="{ authenticated: authenticated, hidden: hidden }")

    ul.navigation-items.pull-left
      router-link.navigation-item.navigation-item-brand(tag="li" to="/") {{ navTitle }}
      router-link.navigation-item.navigation-item-page(tag="li" to="/course") {{ $t('nav.course') }}
      router-link.navigation-item.navigation-item-page(tag="li" to="/schedule") {{ $t('nav.schedule') }}
      router-link.navigation-item.navigation-item-page(tag="li" to="/about") {{ $t('nav.about') }}

    ul.navigation-items.pull-right
      // router-link.navigation-item.navigation-item-page(tag="li" to="/auth") Login
      li.navigation-item.navigation-item-page(v-if="!this.$store.state.auth.isAuthenticated" v-on:click="showAuth") {{ $t('auth.login') }}
      li.navigation-item.navigation-item-page(v-if="this.$store.state.auth.isAuthenticated" v-on:click="logout") {{ $t('auth.logout') }}

    profile-icon(v-if="authenticated")


</template>

<script>
import * as types from '../../store/mutation-types';
import ProfileIcon from './ProfileIcon';

export default {
  name: 'navigation',
  components: {
    ProfileIcon,
  },
  data() {
    return {};
  },
  computed: {
    authenticated() {
      return this.$store.state.auth.isAuthenticated;
    },
    hidden() {
      return !this.$store.state.navigation.visible;
    },
  },
  props: {
    navTitle: String,
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    logout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*";

.navigation
  animate()
  background-color $navigation-background-color
  box-sizing border-box
  height 60px
  padding 0 0 0 60px
  position relative
  z-index 2
  width 100%
  &.hidden
    display none
  &.authenticated
    padding 0 60px
  ul.navigation-items
    cleanlist()
    display inline-block
    text-align left
    li.navigation-item
      cleanlist()
      border-bottom transparent 2px solid
      color $navigation-text-color
      display inline-block
      font-size 0.9em
      line-height 60px
      padding 0 15px
      list-style none
      transition all 0.2s 0.05s linear
      &.navigation-item-brand
        font-weight bold
        font-size 1.1em
      &:hover
        cursor pointer
        &.navigation-item-page
          border-bottom $color-light-grey 2px solid
@media(max-width: 768px)
  ul.navigation-items
    text-align center
    li.navigation-item.navigation-item-brand
      display none

/* App states */

#app.authenticating
  .navigation
    display none
</style>
