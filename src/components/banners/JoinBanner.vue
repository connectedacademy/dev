<template lang="pug">

#join-banner.course-content(v-if="!isRegistered")

  .course-content--header.block
    h1.content-title
      | Ready to join the class?
    .auth-button-wrapper
      .pure-button.pure-button-subtle(@click="attemptAuth") Login with Twitter

</template>

<script>
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

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
  // background-color darken($color-primary, 5%) !important

  .course-content--header
    padding 10px 20px 30px 20px
    text-align center
    h1.content-title
      color $color-text-dark-grey
      // color white !important
    .auth-button-wrapper
      margin 10px auto 0 auto
      text-align center
      // .pure-button
      //   background-color transparent
      //   border white 1px solid
      //   color white
      //   display inline-block
      //   margin 5px
      //   &:hover
      //     background-color white
      //     color $color-warning
</style>
