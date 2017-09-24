<template lang="pug">

.info-dialogue.animated.fadeIn(v-if="!dismissed" v-bind:class="{ dismissed: dismissed }")
  .dismiss-button(v-if="dismissable" @click="dismiss")
    icon(name="times")
  slot

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';

import 'vue-awesome/icons/times';

export default {
  name: 'info-dialogue',
  props: ['dismissable'],
  data() {
    return {
      dismissed: false,
    };
  },
  computed: {
    likeCount() {
      return `${this.count} likes`;
    },
  },
  methods: {
    dismiss() {
      this.dismissed = true;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.info-dialogue
  radius(4px)
  background-color $color-primary
  color white
  margin-bottom 15px
  padding 15px
  position relative
  .dismiss-button
    background-color $color-danger
    color white
    right 0
    bottom 0
    top 0
    position absolute
    width 3px
    text-align center
    animate()
    .fa-icon
      opacity 0
      height 20px
      width 20px
      position absolute
      top 50%
      left 50%
      margin-top -10px
      margin-left -10px
      animate()
  &:hover
    .dismiss-button
      cursor pointer
      width 50px
      .fa-icon
        opacity 1
  p
    reset()

</style>
