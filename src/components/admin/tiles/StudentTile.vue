<template lang="pug">

.student-tile
  img.student--profile(v-bind:src="student.user.profile")
  .student--name {{ student.user.name }}
  .student--email {{ student.user.email }}

</template>

<script>
export default {
  name: 'student-tile',
  props: ['student'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.student-tile
  img.student--profile
    radius(50%)
    height 50px
    width 50px
    position absolute
    top 10px
    left 10px
  .student--name
    color $color-text-dark-grey
    line-height 25px
  .student--email
    color $color-text-light-grey
    line-height 15px

</style>
