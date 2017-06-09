<template lang="pug">

  .drawer#drawer-right(v-bind:class="{ visible: state.visible }")
    .card#profile-container(v-bind:class="{ visible: state.visible }")
      img.user-profile(:src="user.profile")
      h1.user-name {{ user.name }}
      h2.user-account {{ `@${user.account}` }}

      a.pure-button.pure-button-action(v-if="user" v-on:click="logout") {{ $t('auth.logout') }}

    .card#settings-container(v-bind:class="{ visible: state.visible }")
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

      a.pure-button.pure-button-action(v-if="user") Edit Profile

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

@import '~stylus/shared'
@import '~stylus/drawer'

// Profile container
.card

  .pure-button.pure-button-action
    background-color alpha(black, 0.1)
    border-color transparent
    color white
    display block
    margin-top 10px
    &:hover
      background-color alpha(black, 0.2)

  // Profile container
  &#profile-container
    padding 15px
    text-align center
    img.user-profile
      radius(50%)
      height 60px
      width 60px
    h1.user-name
      reset()
      color white
      font-size 1.3em
      font-weight normal
    h2.user-account
      reset()
      color alpha(white, 0.8)
      font-size 1em
      font-weight normal

  // Settings container
  &#settings-container
    padding 15px
    fieldset
      padding 5px
      label
        color white
        margin-bottom 5px
      select
        width 100%
</style>
