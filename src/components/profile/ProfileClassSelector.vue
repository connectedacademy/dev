<template lang="pug">

  .profile-class-selector
    ul.profile-class-selector(v-bind:class="{ selecting: selecting }" @click="expand")
      icon(icon="angle-down")
      li.profile-class-selector--item.active(v-if="!selecting && profileClass" @click="setClass(profileClass)")
        | {{ profileClass.title }}
      li.profile-class-selector--item(v-else v-for="(theClass, index) in classes" v-bind:key="index" v-bind:class="{ active: (profileClassSlug === theClass.slug) }" @click="setClass(theClass)")
        | {{ theClass.title }}
        icon(icon="circle")

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'
import _get from 'lodash/get'

export default {
  name: 'profile-class-selector',
  props: ['activeClass'],
  mounted() {
    if (this.classes.length > 0) {
      this.setClass(this.classes[0])
    }
  },
  data() {
    return {
      selecting: false,
    }
  },
  computed: {
    ...mapGetters(['course', 'profileClass']),
    profileClassSlug() {
      return _get(this.profileClass, 'slug')
    },
    classes() {
      return this.course.classes
    }
  },
  methods: {
    expand() {
      if (!this.selecting) {
        this.selecting = true
      }
      EventBus.$emit('redrawMasonry')
    },
    setClass(theClass) {

      if (theClass !== this.profileClass) {
        this.$store.commit('updateProfileClass', theClass)
        setTimeout(() => {
          this.selecting = false
        }, 200)
        EventBus.$emit('profileClassUpdated')
      }
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

$selector-height = 60px

ul.profile-class-selector
  cleanlist()
  radius(4px)
  box-shadow()
  border-bottom $color-lightest-grey 3px solid
  height $selector-height
  max-width 400px
  min-width 160px
  position relative
  overflow hidden
  z-index 55
  svg
    color $color-border
    height 20px
    width 20px
    margin-top -(20px / 2)
    position absolute
    right 15px
    top 50%
    bottom 0
    z-index 1
  &.selecting
    height auto
    svg
      opacity 0
  li.profile-class-selector--item
    cleanlist()
    animate()
    background-color white
    color #666
    line-height $selector-height
    height 60px
    font-size 1.2em
    font-weight bold
    overflow hidden
    padding 0 40px 0 20px
    position relative
    text-align left
    &:hover
      cursor pointer
      background-color $color-lightest-grey

</style>
