<template lang="pug">

  .navigation.clearfix(v-bind:class="{ registered: isRegistered, hidden: hidden }")

    router-link.navigation-item.navigation-item-brand(to="/") {{ navTitle }}

    ul.navigation-items
      router-link.navigation-item.navigation-item-page(tag="li" to="/") {{ $t('nav.course') }}
      router-link.navigation-item.navigation-item-page(tag="li" to="/schedule") {{ $t('nav.schedule') }}
      router-link.navigation-item.navigation-item-page(tag="li" to="/about") {{ $t('nav.about') }}
      li.navigation-item.navigation-item-page.pull-right(v-if="!isRegistered" v-on:click="showAuth") {{ $t('auth.login') }}

    profile-icon(v-if="isRegistered")

</template>

<script>
import {mapGetters} from 'vuex';

import * as types from '../../store/mutation-types';
import ProfileIcon from './ProfileIcon';

export default {
  name: 'navigation',
  components: {
    ProfileIcon,
  },
  computed: {
    ...mapGetters([
      'isRegistered',
    ]),
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
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*";

.navigation
  animate()
  background-color $navigation-background-color
  box-sizing border-box
  height 120px
  padding 0
  position relative
  text-align center
  z-index 2
  width 100%
  &.hidden
    display none

  .navigation-item-brand
    display block
    color white
    font-weight bold
    font-size 1.1em
    line-height 60px
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

/* App states */

#app.authenticating
  .navigation
    display none
</style>
