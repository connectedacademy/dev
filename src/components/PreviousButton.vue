<template lang="pug">

  .previous-button(name="previous-button" @click="previous")
    icon(name="angle-left")
    | {{ $t('common.previous_page') }}

</template>

<script>
import 'vue-awesome/icons/angle-left';

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
  animate()
  radius(26px)
  color white
  display inline-block
  text-align center
  padding 10px 20px
  margin-bottom 10px
  left 0px
  right 0px
  position relative
  padding-left 30px
  .fa-icon
    height 20px
    padding 0 15px
    position absolute
    left 0
  &:hover
    background-color alpha(white, 0.2)
    cursor pointer
</style>
