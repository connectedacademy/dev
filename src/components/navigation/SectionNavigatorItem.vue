<template lang="pug">

li.navigation-item(v-bind:name="`navigator-${scrollPoint.slug}`" @click="jumpToContent" v-bind:class="{ active: isActive }")
  icon(v-if="scrollPoint.content_type === 'class'" name="play")
  icon(v-else-if="scrollPoint.content_type === 'webinar'" name="play")
  icon(v-else name="circle")

  .content-label {{ scrollPoint.title }}
  .clearfix

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';

import 'vue-awesome/icons/circle';
import 'vue-awesome/icons/play';

export default {
  name: 'section-navigator-item',
  props: ['scrollPoint'],
  computed: {
    ...mapGetters([
      // 'currentActiveSection',
    ]),
    isActive() {
      return false;
      const currentActiveSection = this.currentActiveSection;

      if (!(currentActiveSection && this.scrollPoint)) { return false; }
      return (currentActiveSection.slug === this.scrollPoint.slug);
    },
  },
  methods: {
    jumpToContent() {
      const segmentPosition = this.scrollPoint.sectionTop + 1;

      this.$store.commit(types.PAUSE_MEDIA);
      this.$store.commit('setScrollPosition', segmentPosition);

      setTimeout(() => {
        window.scroll(0, segmentPosition);
      }, 200);
    }
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

li.navigation-item
  animate()
  cleanlist()
  width 100%
  position relative
  height calc(40px)
  overflow hidden
  .fa-icon
    color white
    float left
    padding 14px
    height 12px
    width 12px
    animate()
  .content-label
    animate()
    color white
    font-weight bold
    line-height 40px
    padding 0 15px 0 40px
    position absolute
    left 0
    right 0
    text-transform capitalize
    z-index 1
    pointer-events none
  &.active
    background-color darken($color-primary, 10%)
  &:hover
    background-color darken($color-primary, 5%)
    cursor pointer
    pointer-events all
</style>
