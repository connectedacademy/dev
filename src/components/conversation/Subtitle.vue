<template lang="pug">

  .subtitle(v-bind:style="subtitleStyle" @click="quote" v-once)
    p.subtitle-meta.hidden {{ start }} {{ end }}
    h1(v-html="subtitle.text")

</template>

<script>
/* eslint-disable */
import _ from 'lodash';

export default {
  name: 'subtitle',
  props: ['subtitle'],
  computed: {
    subtitleStyle() {
      const duration = _.floor((this.subtitle.end - this.subtitle.start) * (158.0 * 0.2));
      const topVal = _.floor((this.subtitle.start * (158.0 * 0.2)));
      return { top: `${topVal}px`, height: `${duration}px` };
    },
    start() {
      return this.subtitle.start;
    },
    end() {
      return this.subtitle.end;
    },
    active() {
      return ((this.$store.getters.currentTime > this.start) && (this.$store.getters.currentTime < this.end));
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

@import '../../assets/stylus/shared/*'

.subtitle
  left 0px
  position absolute
  padding 0 10px
  h1
    nomargin()
    nopadding()
    color #999
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
