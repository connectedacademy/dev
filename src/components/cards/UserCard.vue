<template lang="pug">

.card#user-card(v-if="user" v-bind:class="{ visible: visible }")
  img.user-profile(:src="user.profile" @click="showUser = !showUser")
  pre(v-if="showUser") {{ user }}
  h1.user-name {{ user.name }}
  h2.user-account {{ `@${user.account}` }}

  li.pure-button.pure-button-action(v-if="user.admin" @click="navigateTo('/admin')") Admin Panel
  li.pure-button.pure-button-action(@click="showHints()") Show All Hints
  a.pure-button.pure-button-action(v-if="!user.admin" href="https://api.connectedacademy.io/v1/admin/login" target="_self") Admin Login

  .pure-button.pure-button-action(@click="logout") {{ $t('auth.logout') }}

</template>

<script>
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
    navigateTo(toLink) {
      this.toggleRightDrawer();
      this.$router.push(toLink);
    },
    toggleRightDrawer() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER');
    },
    logout() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER');
      this.$store.dispatch('logout');
    },
    showHints() {
      this.$cookie.delete('profile-button');
      this.$cookie.delete('intro-button');
      this.$cookie.delete('section-navigator');
      this.$cookie.delete('media-toggle');
      this.$cookie.delete('play-pause-toggle');
      this.$cookie.delete('view-toggle');
      
      location.reload();
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
@import '~stylus/buttons'
@import '~stylus/drawer'

.card#user-card
  padding 15px
  text-align center
  img.user-profile
    radius(50%)
    background-color alpha(black, 0.1)
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
