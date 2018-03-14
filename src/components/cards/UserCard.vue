<template lang="pug">

.card#user-card(v-if="user" v-bind:class="{ visible: visible }")
  
  img.user-profile(v-bind:src="profileImage")
  
  h1.user-name {{ user.name }}
  h5.user-account {{ user.account }}

  router-link.pure-button.pure-button-info.full-width(v-bind:to="{ name: 'profile' }") {{ $t('auth.dashboard') }}
  //- .pure-button.pure-button-action(v-if="false" @click="showHints") {{ $t('auth.show_hints') }}
  //- .pure-button.pure-button-action(@click="logout") {{ $t('auth.logout') }}

</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'user-card',
  props: ['visible'],
  methods: {
    logout() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER')
      this.$store.dispatch('logout')
    },
    showHints() {
      const hints = ['profile-button', 'intro-button', 'section-navigator', 'media-toggle', 'play-pause-toggle', 'view-toggle']
      for (const hint in hints) {
        this.$cookie.delete(hints[hint])
      }
      location.reload()
    },
  },
  computed: {
    ...mapGetters(['user', 'admin']),
    profileImage() {
      return this.user.profile.replace('_normal', '')
    }
  },
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/drawer'

.card#user-card
  padding 15px
  position relative
  text-align center
  .pure-button
    font-style 1em
    font-weight bold
    padding 13px 0
  img.user-profile
    radius(50%)
    background-color alpha(black, 0.1)
    height 60px
    margin 10px auto
    width 60px
  h1.user-name
    reset()
    color white
    font-size 1.3em
    font-weight bold
  h5.user-account
    reset()
    color alpha(white, 0.8)
    font-size 1em
    font-weight bold
    margin-bottom 20px

</style>
