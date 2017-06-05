<template lang="pug">

  .drawer.drawer-right(v-bind:class="{ visible: state.visible }")
    .profile-container
      img.user-profile(:src="user.profile")
      h1.user-name {{ user.name }}
      h2.user-account {{ `@${user.account}` }}

    .settings-container
      form.pure-form.pure-form-stacked
        fieldset(v-if="user.registration")
          label
            strong {{ $t('common.age') }}
          label {{ `${user.registration.age}` }}
        fieldset(v-if="user.registration")
          label
            strong {{ $t('common.current_language') }}
          label {{ `${user.registration.lang}` }}
        fieldset
          label
            strong {{ $t('common.current_service') }}
          label {{ `${user.service}` }}
        fieldset(v-if="user.registration")
          label
            strong {{ $t('common.current_hub') }}
          label {{ `${user.registration.hub_id}` }}

        fieldset
          .pure-button.pure-button-primary.full-width(v-if="user" v-on:click="logout") {{ $t('auth.logout') }}
          router-link.pure-button.pure-button-primary.full-width.hidden(to="/registration" @click="toggleRightDrawer") {{ $t('auth.register') }}

      pre.hidden {{ user }}



</template>

<script>
import * as types from '@/store/mutation-types';

export default {
  name: 'right-drawer',
  methods: {
    toggleRightDrawer() {
      this.$store.commit(types.TOGGLE_RIGHT_DRAWER);
    },
    logout() {
      this.toggleRightDrawer();
      this.$store.dispatch('logout');
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    state() {
      return this.$store.state.navigation.rightDrawer;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../../assets/stylus/shared";

.drawer-right
  position fixed
  top 0
  bottom 0
  right -320px
  max-width 320px
  width calc(100% - 60px)
  transition right 0.4s
  &.visible
    right 0px

  // Profile container
  .profile-container
    padding 20px
    text-align center
    img.user-profile
      radius(50%)
      height 60px
      width 60px
    h1.user-name
      nomargin()
      nopadding()
      color white
      font-size 1.3em
      font-weight normal
    h2.user-account
      nomargin()
      nopadding()
      color white
      font-size 1em
      font-weight normal

  // Settings container
  .settings-container
    padding 20px
    fieldset
      label
        color white
        margin-bottom 5px
      select
        width 100%
</style>
