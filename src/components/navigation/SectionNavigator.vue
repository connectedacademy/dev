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
  min-height 40px
  min-width 40px
  position fixed
  top 90px
  right 10px
  z-index 51
  ul.navigation-items
    cleanlist()
    radius(30px)
  @media(max-width: 900px)
    display none

</style>
