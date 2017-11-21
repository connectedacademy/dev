<template lang="pug">

  .profile-class-selector
    ul.profile-class-selector(v-bind:class="{ selecting: selecting }" @click="expand")
    
      li.profile-class-selector--item.active(v-if="!selecting && profileClass" @click="setClass(profileClass)")
        | {{ profileClass.title }}
        .toggle
      li.profile-class-selector--item(v-else v-for="(theClass, index) in classes" v-bind:key="index" v-bind:class="{ active: (profileClassSlug === theClass.slug) }" @click="setClass(theClass)")
        | {{ theClass.title }}
        .toggle

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';
import _get from 'lodash/get';

export default {
  name: 'profile-class-selector',
  props: ['activeClass', 'classes'],
  mounted() {
    this.getClasses();
    EventBus.$on('updateClasses', () => {
      this.getClasses();
    });
  },
  watch: {
    classes(nV, oV) {
      if (nV && (typeof nV !== 'undefined') && nV.length > 0) {
        this.setClass(nV[0]);
      }
    }
  },
  data() {
    return {
      selecting: false,
    }
  },
  computed: {
    ...mapGetters(['profileClass']),
    profileClassSlug() {
      return _get(this.profileClass, 'slug');
    },
  },
  methods: {
    getClasses() {

      API.profile.getClasses(
        (response) => {
          this.$emit('update:classes', response);
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve classes list');
          this.$emit('update:classes', []);
        },
      );
    },
    expand() {
      if (!this.selecting) {
        this.selecting = true;
      }
    },
    setClass(theClass) {

      if (this.selecting && (theClass !== this.profileClass)) {
        this.$store.commit('updateProfileClass', theClass);
        setTimeout(() => {
          this.selecting = false;
        }, 200)
        EventBus.$emit('profileClassUpdated');
      }
    },
  },
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

$selector-height = 40px

ul.profile-class-selector
  cleanlist()
  radius(4px)
  box-shadow()
  margin 15px 5px
  height $selector-height
  max-width 280px
  min-width 160px
  overflow hidden
  &.selecting
    height auto
  li.profile-class-selector--item
    cleanlist()
    animate()
    background-color white
    border-bottom $color-border 1px solid
    padding 0 20px
    line-height $selector-height
    position relative
    &:hover
      cursor pointer
      background-color $color-lightest-grey
    .toggle
      radius(50%)
      background-color $color-border

      height 10px
      width 10px
      margin-top -(10px / 2)
      position absolute
      right 10px
      top 50%
      bottom 0
    &.active
      .toggle
        background-color $color-success
    &:last-child
      border-bottom none

</style>
