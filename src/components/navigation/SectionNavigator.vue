<template lang="pug">
#section-navigator-wrapper
  transition(name="fade")
    #section-navigator(v-if="isVisible")
      onboarding-prompt(identifier="section-navigator" prompt="click to navigate class" top="-40" left="-210" position="bottom-right" z-index="1")
      section-navigator-item(v-for="item in items" v-bind:key="item.slug" v-bind:scroll-point="item")

</template>

<script>
import {mapGetters} from 'vuex';
import SectionNavigatorItem from './SectionNavigatorItem';
import size from 'lodash/size';
import orderBy from 'lodash/orderBy';

export default {
  name: 'section-navigator',
  computed: {
    ...mapGetters(['scrollPoints']),
    isVisible() {
      return size(this.scrollPoints)
    },
    items() {
      return orderBy(this.scrollPoints, ['sectionTop'])
    }
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
  position fixed
  top 280px
  right -240px
  z-index 51
  width 280px
  ul.navigation-items
    cleanlist()
    radius(30px)
  &:hover
    right 0px
  @media(max-width: 900px)
    display none

</style>
