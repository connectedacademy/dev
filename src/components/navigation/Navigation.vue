<template lang="pug">

  #navigation(v-bind:class="{ registered: isRegistered, visible: visible, minimized: navigation.minimized }")

    #navigation-bar
    
    #login-button(v-if="!isRegistered" name="nav-login-button" @click="showAuth") Login

    navigation-button
    
    profile-icon(v-if="isRegistered")


</template>

<script>
import {mapGetters} from 'vuex'

import * as types from '@/store/mutation-types'
import NavigationButton from '@/components/navigation/NavigationButton'
import ProfileIcon from '@/components/navigation/ProfileIcon'
import Auth from '@/mixins/Auth'

export default {
  name: 'navigation',
  mixins: [
    Auth
  ],
  components: {
    NavigationButton,
    ProfileIcon
  },
  computed: {
    ...mapGetters([
      'isRegistered', 'navigation'
    ]),
    isRegistering() {
      return this.$route.name === 'registration'
    },
    visible() {
      return this.$store.state.navigation.visible
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#login-button
  animate()
  color white
  font-weight bold
  height $navigation-height
  line-height $navigation-height
  padding 0 15px
  position absolute
  top 0
  right 0
  z-index 52
  svg
    height $navigation-height - -14px 20px
    margin 10px auto
  &:hover
    background-color alpha(black, 0.1)
    cursor pointer

#navigation
  display none
  &.visible
    display block

#navigation-bar
  animate()
  background-color alpha($color-primary, 0.9)
  height $navigation-height
  pointer-events none
  position fixed
  top - $navigation-height
  z-index 2
  width 100%

  @media(max-width: ($col-width + 120px))
    top 0

  #logo-text
    color white
    font-size 1em
    font-weight bold
    line-height $navigation-height
    margin 0 10px

</style>
