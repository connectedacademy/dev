<template lang="pug">

#section-navigator(v-if="isVisible")
  transition-group(name="fade" mode="in-out" tag="ul" class="navigation-items")
    section-navigator-item(v-for="scrollPoint in scrollPoints" v-bind:key="scrollPoint.slug" v-bind:scroll-point="scrollPoint")

</template>

<script>
import {mapGetters} from 'vuex';
import SectionNavigatorItem from './SectionNavigatorItem';
import _ from 'lodash/core';

export default {
  name: 'section-navigator',
  computed: {
    ...mapGetters(['scrollPoints']),
    isVisible() {
      return _.size(this.scrollPoints)
    },
  },
  components: {
    SectionNavigatorItem,
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#section-navigator
  animate()
  background-color $color-primary
  border-top-left-radius 6px
  border-bottom-left-radius 6px
  border alpha(black, 0.1) 1px solid
  overflow hidden
  position fixed
  top 70px
  right -240px
  z-index 51
  top 50%
  transform translateY(-50%)
  width 280px
  &:hover
    right 0px
  ul.navigation-items
    cleanlist()
    radius(30px)
  @media(max-width: 900px)
    display none

</style>
