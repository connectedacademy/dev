<template lang="pug">

.card#user-card(v-if="user" v-bind:class="{ visible: visible }")
  #admin-link(@click="navigateToAdmin()")
    icon(name="cog")
  img.user-profile(:src="user.profile" @click="showUser = !showUser")
  //- pre(v-if="showUser") {{ user }}
  h1.user-name {{ user.name }}
  h2.user-account {{ `@${user.account}` }}

  li.pure-button.pure-button-action(@click="showHints()") Show Hints

  .pure-button.pure-button-action(@click="logout") {{ $t('auth.logout') }}

</template>

<script>
import {mapGetters} from 'vuex';

import 'vue-awesome/icons/cog';

export default {
  name: 'user-card',
  props: ['visible'],
  data() {
    return {
      showUser: false,
    };
  },
  methods: {
    navigateToAdmin() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER');
      if (this.user && this.user.admin) {
        this.$router.push('/admin');
      } else if (this.user) {
        window.location = 'https://api.connectedacademy.io/v1/admin/login';
      }
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
  position relative
  text-align center
  #admin-link
    animate()
    color alpha(white, 0.7)
    position absolute
    top 0
    right 0
    padding 20px
    z-index 2
    .fa-icon
      height 20px
    &:hover
      color white    
      cursor pointer
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
