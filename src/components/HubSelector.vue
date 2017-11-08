<template lang="pug">

ul.hub-selector
  li.hub(v-for="hub in hubs" v-bind:class="{active: (hub.id === 'ncl')}")
    h1.hub-name {{ hub.name }}
    h2.hub-timezone {{ hub.timezone }}
  .clearfix

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'hub-selector',
  mounted() {
    this.$store.dispatch('getHubs');
  },
  computed: {
    ...mapGetters ([
      'hubs'
    ]),
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

// ul.hub-selector
//   cleanlist()
//   display none
//   margin 0 -10px
//   li.hub-selector--tile
//     cleanlist()
//     animate()
//     background-color white
//     box-sizing()
//     border $color-border 1px solid
//     float left
//     height 100px
//     overflow hidden
//     text-align center
//     position relative

//     margin 10px
//     padding 10px 0px

//     width calc((calc(100% - 0px) / 3) - 20px)
//     @media(max-width: 600px)
//       width calc(50% - 20px)

//     h1.hub-title
//       animate()
//       reset()
//       color $color-text-dark-grey
//       font-size 1.2em
//       line-height 30px
//       padding 15px 0
//       position absolute
//       top 50%
//       margin-top -30px
//       text-align center
//       width 100%
//     h2.hub-timezone
//       animate()
//       reset()
//       color $color-text-light-grey
//       font-size 1em
//       line-height 20px
//       opacity 0
//       position absolute
//       left 0
//       right 0
//       top 50%
//       margin-top 5px

//     &:hover
//       cursor pointer
//       border-color $color-primary
//       background-color darken($color-primary, 10%)
//       h1.hub-title, h2.hub-timezone
//         color white
//       h1.hub-title
//         margin-top -45px
//       h2.hub-timezone
//         opacity 1

//     &.selected
//       background-color $color-success
//       border-color $color-success
//       h1.hub-title, h2.hub-timezone
//         color white

ul.hub-selector
  cleanlist()
  margin 10px -10px
  li.hub
    cleanlist()
    radius(6px)
    transition(background-color 0.3s linear)
    background-color alpha(white, 0.6)
    float left
    text-align center
    margin 10px
    padding 20px
    @media(max-width: 1600px)
      width calc((100% / 3) - 60px)
    @media(max-width: 768px)
      width calc(100% - 60px)
    h1.hub-name
      reset()
      color $color-primary
      font-size 1.3em
    h2.hub-timezone
      reset()
      color $color-primary
      font-size 1.1em
      &:hover
        cursor pointer
    &:hover, &.active
      background-color alpha(white, 1.0)
      cursor pointer

</style>
