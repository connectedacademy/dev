<template lang="pug">

#section-navigator
  transition-group(name="fade" mode="in-out" tag="ul" class="navigation-items")
    section-navigator-item(v-for="scrollPoint in scrollPoints" v-bind:key="scrollPoint.slug" v-bind:scroll-point="scrollPoint")

</template>

<script>
import {mapGetters} from 'vuex';
import SectionNavigatorItem from './SectionNavigatorItem';

export default {
  name: 'section-navigator',
  computed: {
    ...mapGetters(['scrollPoints']),
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
  overflow hidden
  position fixed
  top 70px
  right 0
  z-index 51
  top 50%
  transform translateY(-50%)
  width 40px
  &:hover
    width 220px
  ul.navigation-items
    cleanlist()
    radius(30px)
  @media(max-width: 900px)
    display none

</style>
