<template lang="pug">

  .subtitle(v-bind:style="subtitleStyle")
    h1(v-html="subtitle.text")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';

export default {
  name: 'subtitle',
  props: ['subtitle', 'currentSegmentGroup'],
  computed: {
    subtitleStyle() {
      const topVal = _.floor((this.subtitle.start * (158.0 * 0.2)));
      return { top: `${topVal}px` };
    },
    start() {
      return this.subtitle.start;
    },
    end() {
      return this.subtitle.end;
    },
    active() {
      return ((this.currentSegmentGroup > this.start) && (this.currentSegmentGroup < this.end));
    },
  },
  methods: {
    quote() {
      // alert(`Quote - ${this.subtitle.text}`);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.subtitle
  left 0px
  position absolute
  padding 0 20px
  h1
    reset()
    color $color-darker-grey
    font-size 1em
    animate()
  p.subtitle-meta
    font-size 0.6em
    line-height 10px
    position absolute
    top -10px
  &:hover
    color $color-purple
    cursor pointer
  &.active
    h1
      /*color $color-primary*/
      color #111
    p.subtitle-meta
      color $color-text-grey

</style>
