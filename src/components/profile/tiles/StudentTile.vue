<template lang="pug">

.student-tile
  img.student--profile(v-bind:src="student.profile")
  a.student--name(v-bind:href="student.link") {{ student.name }}
  .student--email {{ `@${student.account}` }}
  //- p {{ (student.admin) ? 'Administrator' : 'Standard User' }}
  ul.labels
    li.label
      icon(name="comment")
      | {{ student.messages }}
    li.label
      icon(name="graduation-cap")
      | {{ student.homework }}
    .clearfix

</template>

<script>
import 'vue-awesome/icons/comment';
import 'vue-awesome/icons/graduation-cap';

export default {
  name: 'student-tile',
  props: ['student'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.student-tile
  border-bottom $color-border 1px solid
  padding 10px 20px 10px 80px
  position relative
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
      .fa-icon
        margin-right 6px

</style>
