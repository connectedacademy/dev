<template lang="pug">

  .subtitle(v-bind:style="subtitleStyle" v-bind:class="{ active: active }")
    h1(v-html="subtitle.text")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';

export default {
  name: 'subtitle',
  props: ['subtitle', 'currentSegment'],
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
      return (this.currentSegment > (this.start - 0) && this.currentSegment < (this.end + 0));
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
    transition(color 0.3s linear)
    reset()
    color $color-text-grey
    font-family 'Avenir', Helvetica, Arial, sans-serif
    font-size 1.1em
    font-weight normal
    &:hover
      cursor pointer
      color $color-primary

  &.active
    h1
      color $color-primary // $color-text-darkest-grey

</style>
