<template lang="pug">

  .drawer.drawer-left(v-bind:class="{ visible: state.visible }")

    router-link.brand-logo(to="/")
      p connected
      p academy

    ul.drawer-list

      router-link.drawer-list-item(tag="li" to="/" v-bind:class="{ visible: state.visible }")
        h1.drawer-list-item--header {{ $t('nav.course') }}
        h2.drawer-list-item--body {{ $t('nav.course_description') }}
      //-
        router-link.drawer-list-item(tag="li" to="/schedule" v-bind:class="{ visible: state.visible }")
          h1.drawer-list-item--header {{ $t('nav.schedule') }}
          h2.drawer-list-item--body {{ $t('nav.schedule_description') }}
      router-link.drawer-list-item(tag="li" to="/about" v-bind:class="{ visible: state.visible }")
        h1.drawer-list-item--header {{ $t('nav.about') }}
        h2.drawer-list-item--body {{ $t('nav.about_description') }}

      li.drawer-list-item.hidden(v-for="(theClass, index) in course.classes" v-bind:key="theClass.name" v-bind:class="{ visible: state.visible }" @click="setCurrentClass(theClass.slug)")
        h1.drawer-list-item--header {{ theClass.title }}
        h2.drawer-list-item--body {{ theClass.description }}

    .drawer-footer
      a.credits(href="https://openlab.ncl.ac.uk/" target="_blank")
        | Built with
        icon.icon-margin(name="coffee")
        | at Open Lab

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
    state() {
      return this.$store.state.navigation.leftDrawer;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

ul.navigation-items
  list-style none
  margin 0
  padding 0

  li.navigation-item
    list-style none
    margin 0
    padding 0
    color white

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

/* Drawer List */
ul.drawer-list
  list-style none
  margin 0
  padding 0
  li.drawer-list-item
    background-color alpha(white, 0)
    opacity 0
    list-style none
    margin 0
    padding 15px 40px 15px 25px
    position relative
    transition background-color 0.6s, left 0.6s, opacity 0.6s

    for num in (1..100)
      &:nth-child({num}n)
        left (num * -100px)

    h1
      color white
      margin 0
      padding 0
      font-size 1.6em

    h2
      color alpha(white, 0.6)
      margin 0
      padding 0
      font-size 1em
      font-weight normal

    &.visible
      left 0
      opacity 1

    &:hover
      cursor pointer
      background-color alpha(white, 0.025)

/* Footer */
.drawer-footer
  pinned()
  padding 10px
  top auto
  background-color darken($color-darkest-purple, 10%)
  position absolute
  z-index 1
  text-align center
  a.credits
    reset()
    color alpha(white, 0.2)
    text-decoration none
    &:hover
      animate()
      color alpha(white, 0.5)

</style>
