<template lang="pug">

.playhead-bobble()
  icon(name="twitter" scale="2" class="playhead-icon")

</template>

<script>
import API from '../api';
import { mapGetters } from 'vuex';

export default {
  name: 'playhead',
  created() {},
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared/*'

.playhead-bobble
  radius(50%)
  background-color $color-primary
  color white
  height 60px
  width 60px
  position absolute
  top -70px
  right -30px
  z-index 53
  animate()
  @media(max-width: 860px)
    margin-right 0
    right 10px
  &:hover
    cursor pointer
    background-color darken($color-primary, 10%)
  .playhead-icon
    height 30px
    margin 15px


</style>
