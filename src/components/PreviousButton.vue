<template lang="pug">

  .previous-button(@click="previous") {{ $t('common.previous_page') }}

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

@import '../assets/stylus/shared'

.previous-button
  background-color $color-light-grey
  border-top-right-radius 6px
  border-bottom-right-radius 6px
  color $color-text-dark-grey
  display inline-block
  text-align center
  margin-top 20px
  padding 6px 12px
  left 0
  animate()
  &:hover
    background-color darken($color-light-grey, 10%)
    cursor pointer

</style>
