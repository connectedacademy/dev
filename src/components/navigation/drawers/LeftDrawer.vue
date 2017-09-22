<template lang="pug">

transition(name="slide-left")
  .drawer#drawer-left(v-if="isVisible")

    .card

      ul.drawer-list

        router-link.drawer-list-item(tag="li" to="/")
          h1.drawer-list-item--header {{ $t('nav.take_part') }}
          h2.drawer-list-item--body {{ $t('nav.take_part_description') }}

        //- router-link.drawer-list-item(tag="li" to="/schedule")
          h1.drawer-list-item--header {{ $t('nav.schedule') }}
          h2.drawer-list-item--body {{ $t('nav.schedule_description') }}

        router-link.drawer-list-item(tag="li" to="/about")
          h1.drawer-list-item--header {{ $t('nav.about') }}
          h2.drawer-list-item--body {{ $t('nav.about_description') }}

        li.drawer-list-item.hidden(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name")
          h1.drawer-list-item--header {{ theClass.title }}
          h2.drawer-list-item--body {{ theClass.description }}

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';

import Overlay from '@/mixins/Overlay';

export default {
  name: 'left-drawer',
  mixins: [
    Overlay,
  ],
  watch: {
    '$route': {
      handler: function(nV, oV) {
        this.dismissOverlay();
      },
      deep: true,
    },
  },
  methods: {
    toggleLeftDrawer() {
      this.$store.commit(types.TOGGLE_LEFT_DRAWER);
    },
    setCurrentClass(newClass) {
      this.$store.commit(types.TOGGLE_LEFT_DRAWER);
      this.$store.dispatch('getSpec', newClass);
    },
  },
  computed: {
    ...mapGetters([
      'course',
    ]),
    isVisible() {
      return this.$store.state.navigation.leftDrawer.visible;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

/* Brand Logo */
.brand-logo
  display block
  padding 15px 25px
  text-decoration none
  p
    reset()
    color white
    font-size 1em
    font-weight normal
    line-height 15px
    &:last-child
      padding-left 30px

</style>
