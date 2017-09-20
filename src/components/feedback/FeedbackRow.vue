<template lang="pug">

.feedback-row(v-bind:class="{ active: active }")

  .user-strip
    img.user-profile-image(v-bind:src="content.user.profile")
    h5.user-profile-name {{ content.user.name }}
    p.message-count {{ content.message ? content.message : 'no' }} messages

  .unread-count.animated.tada(v-if="content.unread") {{ content.unread }}

</template>

<script>
export default {
  name: 'feedback-row',
  props: ['content', 'active'],
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.feedback-row
  animate()
  background-color white
  border-left white 3px solid
  height 69px
  position relative

  .unread-count
    radius(12px)
    background-color $color-homework
    color white
    display inline-block
    font-size 0.8em
    height 24px
    line-height 24px
    min-width 8px
    padding 0 8px
    position absolute
    right 5px
    top 5px

  .user-strip
    padding 10px
    padding-left 60px
    position relative

    img.user-profile-image
      radius(50%)
      height 50px
      width 50px
      position absolute
      top 10px
      left 10px

    h5.user-profile-name
      animate()
      reset()
      height 30px
      line-height 30px
      padding 0 10px

    p.message-count
      reset()
      color $color-text-light-grey
      font-size 0.9em
      padding 0 10px

  &:hover
    cursor pointer
    .user-strip
      h5.user-profile-name
        color $color-homework

  &.active
    border-left-color $color-homework
    .user-strip
      h5.user-profile-name
        color $color-homework

  @media(max-width: 600px)
    .user-strip
      h5.user-profile-name, p.message-count
        display none


</style>
