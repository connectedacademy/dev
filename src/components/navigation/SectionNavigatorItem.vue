<template lang="pug">

li.navigation-item(@click="jumpToContent" v-bind:class="{ active: isActive }")
  icon(name="circle")
  .content-label {{ scrollPoint.slug }}
  .clearfix

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'section-navigator-item',
  props: ['scrollPoint'],
  computed: {
    ...mapGetters([
      'currentActiveSection',
    ]),
    isActive() {
      const currentActiveSection = this.currentActiveSection;

      if (!(currentActiveSection && this.scrollPoint)) { return false; }
      return (currentActiveSection.slug === this.scrollPoint.slug);
    },
  },
  methods: {
    jumpToContent() {
      window.scroll(0, this.scrollPoint.sectionTop + 1);
    }
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*";

li.navigation-item
  cleanlist()
  radius(20px)
  background-color $color-primary
  width calc(40px - 8px)
  position relative
  margin 4px
  height calc(40px - 8px)
  animate()
  .fa-icon
    color white
    float left
    padding 10px
    height 12px
    width 12px
    animate()
  .content-label
    radius(20px)
    background-color alpha(black, 0.3)
    color white
    font-weight bold
    line-height 32px
    opacity 0
    padding 0 50px 0 15px
    position absolute
    right 0
    text-transform uppercase
    animate()
  &:hover
    background-color white
    cursor pointer
    .fa-icon
      color $color-primary
    .content-label
      opacity 1
  &.active
    background-color $color-success
    width auto
    &:hover
      background-color darken($color-success, 10%)
      .fa-icon
        color white
</style>
