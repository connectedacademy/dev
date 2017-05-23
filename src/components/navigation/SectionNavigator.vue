<template lang="pug">

.section-navigator
  ul.navigation-items
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

@import "../../assets/stylus/shared/*";

.section-navigator
  radius(30px)
  background-color $color-purple
  min-height 40px
  min-width 40px
  position fixed
  top 60px
  right 10px
  ul.navigation-items
    cleanlist()

</style>
