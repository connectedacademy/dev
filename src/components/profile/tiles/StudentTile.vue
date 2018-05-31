<template lang="pug">

.student-tile
  img.student--profile(v-bind:src="student.profile.avatar")
  a.student--name(v-bind:href="student.link") {{ student.profile.name }}
  .student--account {{ `@${student.twitter.username}` }}

</template>

<script>

export default {
  name: 'student-tile',
  props: ['student']
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.student-tile
  padding 10px 30px 15px 70px
  position relative
  img.student--profile
    radius(50%)
    height 40px
    width 40px
    position absolute
    top 10px
    left 20px
  .student--name
    color $color-text-dark-grey
    line-height 25px
  .student--account
    color $color-text-light-grey
    line-height 15px
  ul.labels
    cleanlist()
    margin-top 10px
    li.label
      cleanlist()
      radius(4px)
      color $color-text-grey
      display inline-block
      float left
      margin-right 10px
      padding 0 10px
      svg
        margin-right 6px

</style>
