<template lang="pug">

  .subtitle.active(v-bind:style="subtitleStyle" @click="quote")
    h1(v-html="subtitle.text")
    p.hidden {{ subtitle.start }} {{ subtitle.end }}

</template>

<script>
/* eslint-disable */
import _ from 'lodash';

export default {
  name: 'subtitle',
  props: ['subtitle'],
  computed: {
    subtitleStyle() {
      const duration = ((this.subtitle.end - this.subtitle.start) * (158.0 * 0.2));
      const topVal = (this.subtitle.start * (158.0 * 0.2));
      return { top: `${topVal}px`, height: `${duration}px` };
    },
  },
  methods: {
    quote() {
      alert(`Quote - ${this.subtitle.text}`);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.subtitle
  border-left $color-purple 3px solid
  left 0px
  position absolute
  margin 0 10px
  max-width 300px
  padding 0 10px
  h1
    font-size 1em
  &:hover
    color $color-purple
    cursor pointer

</style>
