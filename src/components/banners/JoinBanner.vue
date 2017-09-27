<template lang="pug">

#join-banner.course-content(v-if="!isRegistered && loaded")

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
  data() {
    return {
      loaded: false
    }
  },
  computed: {
    ...mapGetters([
      'isRegistered',
    ]),
  },
  mounted() {
    setTimeout(() => { this.loaded = true; }, 100);
  },
  methods: {
    attemptAuth() {
      this.$store.commit('attemptAuth');
    },
  },
}
</script>

<style lang="stylus">

@import '~stylus/buttons'

#join-banner.course-content
  background-color white
  @media(min-width: 800px)
    radius(4px)
    box-shadow()
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
