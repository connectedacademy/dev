<template lang="pug">

  transition(name="slide-right")
    .drawer#drawer-right(v-if="isVisible")

      user-card(:visible="isVisible")
      //- .card#notifications-card
        .notification
          .notification-title Mention
          .notification-body You were mentioned by someone in a comment..
      classroom-card(:visible="isVisible")
      //- profile-card(:visible="isVisible")
      .card#auth-card
        .pure-button.pure-button-action(@click="logout") {{ $t('auth.logout') }}

</template>

<script>
import ClassroomCard from '@/components/cards/ClassroomCard'
import ProfileCard from '@/components/cards/ProfileCard'
import UserCard from '@/components/cards/UserCard'

export default {
  name: 'right-drawer',
  components: {
    ClassroomCard,
    ProfileCard,
    UserCard,
  },
  methods: {
    toggleRightDrawer() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER')
    },
    logout() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER')
      this.$store.dispatch('logout')
    }
  },
  computed: {
    isVisible() {
      return this.$store.state.navigation.rightDrawer.visible
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/shared'
@import '~stylus/drawer'

.card#notifications-card
  padding 15px
  .notification
    radius(6px)
    // border alpha(white, 0.2) 1px solid
    padding 15px
    .notification-title, .notification-body
      color white
    .notification-title
      font-weight bold
      &:before
        radius(50%)
        background-color $color-success
        content ''
        display inline-block
        height 12px
        margin-right 8px
        position relative
        width 12px

.card#auth-card
  padding 30px 15px
  position relative
  text-align center
  .pure-button
    font-size 1em
    font-weight bold
    margin 0
    padding 13px 0
</style>
