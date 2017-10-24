<template lang="pug">

  .profile-class-selector
    h3 Select a class

    ul.profile-class-selector(v-bind:class="{ selecting: selecting }")
      li.profile-class-selector--item(v-if="showAll && (classActive(undefined) || selecting)" v-bind:class="{'active': !activeClass }" @click="setClass(undefined)")
        | All
        .toggle(v-bind:class="{ active: !activeClass }")
      li.profile-class-selector--item(v-for="(theClass, index) in classes" v-bind:key="index" v-if="classActive(theClass) || selecting" v-bind:class="{'active': classActive(theClass) }" @click="setClass(theClass)")
        | {{ theClass.title }}
        .toggle(v-bind:class="{ active: classActive(theClass) }")

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import _get from 'lodash/get';

export default {
  name: 'profile-class-selector',
  props: ['activeClass', 'showAll', 'classes'],
  mounted() {
    this.getClasses();
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
    classActive(theClass) {
      return this.profileClassSlug === _get(theClass, 'slug');
    },
    setClass(theClass) {

      if (this.selecting) {
        this.$store.commit('updateProfileClass', theClass);
      }
      this.selecting = !this.selecting;
    },
  },
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

ul.profile-class-selector
  cleanlist()
  border $color-border 1px solid
  margin 20px 0
  min-height 64px
  max-width 400px
  li.profile-class-selector--item
    cleanlist()
    background-color white
    border-bottom $color-border 1px solid
    padding 20px
    padding-right 30px
    position relative
    &:hover
      cursor pointer
      background-color $color-lightest-grey
    .toggle
      radius(50%)
      background-color $color-danger
      height 10px
      width 10px
      margin-top -(10px / 2)
      position absolute
      right 10px
      top 50%
      bottom 0
      &.active
        background-color $color-success
    &:last-child
      border-bottom none

</style>
