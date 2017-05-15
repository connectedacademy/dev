<template lang="pug">

  .section-navigator
    ul.navigation-items
      li.navigation-item(v-for="scrollPoint in scrollPoints" @click="jumpToContent(scrollPoint.top)")

</template>

<script>
import {mapGetters} from 'vuex';

import * as types from '@/store/mutation-types';

export default {
  name: 'section-navigator',
  components: {},
  computed: {
    ...mapGetters([
      'isRegistered',
      'scrollPoints',
    ]),
  },
  methods: {
    jumpToContent(position) {
      console.log(`${position}px`);
      document.getElementById('col-main').scrollTop = position;
    }
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/shared/*";

.section-navigator
  radius(30px)
  background-color $color-purple
  width 40px
  position fixed
  top 60px
  right 10px
  ul.navigation-items
    cleanlist()
    li.navigation-item
      cleanlist()
      radius(50%)
      background-color $color-primary
      width calc(40px - 8px)
      margin 4px
      height calc(40px - 8px)
      animate()
      &:hover
        background-color white
        cursor pointer

</style>
