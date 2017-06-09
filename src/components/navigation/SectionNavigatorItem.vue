<template lang="pug">

li.navigation-item(@click="jumpToContent" v-bind:class="{ active: isActive }")
  icon(v-if="scrollPoint.content_type === 'class'" name="play")
  icon(v-else-if="scrollPoint.content_type === 'webinar'" name="play")
  icon(v-else name="circle")

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
      const segmentPosition = this.scrollPoint.sectionTop + 1;

      this.$store.commit('setScrollPosition', segmentPosition);

      this.$nextTick(function() {
        window.scroll(0, segmentPosition);
      });
    }
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

li.navigation-item
  cleanlist()
  radius(20px)
  background-color alpha(black, 0.1)
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
    background-color white//alpha(black, 0.5)
    box-shadow 0 0 5px 5px alpha(black, 0.05)
    color $color-primary
    font-weight bold
    line-height 32px
    opacity 0
    padding 0 40px 0 15px
    position absolute
    right 0
    text-transform uppercase
    z-index -1
    pointer-events none
    animate()
  &.active
    background-color $color-primary
    width auto
  &:hover
    background-color white
    cursor pointer
    pointer-events all
    .fa-icon
      color $color-primary
    .content-label
      opacity 1
</style>
