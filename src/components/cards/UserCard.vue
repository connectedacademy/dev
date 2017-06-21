<template lang="pug">

.card#user-card(v-if="user" v-bind:class="{ visible: visible }")
  img.user-profile(:src="user.profile" @click="showUser = !showUser")
  pre(v-if="showUser") {{ user }}
  h1.user-name {{ user.name }}
  h2.user-account {{ `@${user.account}` }}

  router-link.pure-button.pure-button-action(v-if="user.admin" to="/admin") Admin Panel
  a.pure-button.pure-button-action(v-if="!user.admin" href="https://api.connectedacademy.io/v1/admin/login" target="_self") Admin Login

  .pure-button.pure-button-action(@click="logout") {{ $t('auth.logout') }}

</template>

<script>
import _ from 'lodash';
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';

export default {
  name: 'user-card',
  props: ['visible'],
  data() {
    return {
      showUser: false,
    };
  },
  methods: {
    logout() {
      this.$store.commit(types.TOGGLE_RIGHT_DRAWER);
      this.$store.dispatch('logout');
    },
  },
  computed: {
    ...mapGetters(['user', 'admin']),
    authenticatedAsAdmin() {
      return false;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

.card#user-card
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

</style>
