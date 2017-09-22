<template lang="pug">

#join-banner.course-content(v-if="!isRegistered")

  .course-content--header
    h1.content-title
      | Ready to join the class?
    .auth-button-wrapper
      .pure-button.pure-button-twitter(@click="attemptAuth") Login with Twitter

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'join-banner',
  computed: {
    ...mapGetters([
      'isRegistered',
    ]),
  },
  methods: {
    attemptAuth() {
      this.$store.commit('attemptAuth');
    },
  },
}
</script>

<style lang="stylus" scoped>

@import '~stylus/layout/course-content'

#join-banner.course-content
  radius(4px)
  box-shadow()
  background-color white
  @media(max-width: 800px)
    radius(0)
    margin 20px 0 0 0
  .course-content--header
    padding 10px 20px 30px 20px
    text-align center
    h1.content-title
      color $color-text-dark-grey
      margin 20px auto
    .auth-button-wrapper
      margin 10px auto 0 auto
      text-align center
</style>
