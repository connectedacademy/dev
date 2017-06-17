<template lang="pug">

  .previous-button(@click="previous")
    icon(name="angle-left")
    | {{ $t('common.previous_page') }}

</template>

<script>

export default {
  name: 'previous-button',
  methods: {
    previous() {
      return this.$router.go(-1);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.previous-button
  /*background-color alpha(white, 0.2)*/
  /*border white 1px solid*/
  radius(6px)
  color white
  display inline-block
  text-align center
  /*margin-top 20px*/
  padding 10px 20px
  margin-bottom 10px
  left 0px
  right 0px
  /*top 50px*/
  position relative
  padding-left 30px
  .fa-icon
    height 20px
    padding 0 15px
    position absolute
    left 0

  animate()
  &:hover
    background-color alpha(white, 0.2)
    cursor pointer

/*.previous-button
  animate()
  border-top-left-radius 6px
  border-bottom-left-radius 6px
  background-color alpha(white, 0.8)
  color white
  height 50px
  position absolute
  left -35px
  top 20px
  width 35px
  .fa-icon
    color $color-primary
    height 50px
    margin 0 15px
    width 10px
  &:hover
    background-color darken($color-light-grey, 10%)
    cursor pointer*/

</style>
