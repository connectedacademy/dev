<template lang="pug">
#section-navigator-wrapper(v-if="scrollPoints.length > 3")
  onboarding-prompt(identifier="section-navigator" prompt="navigate class" top="-45" left="-150" position="bottom-right" z-index="1")
  transition(name="fade")
    #section-navigator(v-if="isVisible")
      section-navigator-item(v-for="item in items" v-bind:key="item.slug" v-bind:scroll-point="item")

</template>

<script>
import { mapGetters } from 'vuex'

import SectionNavigatorItem from '@/components/navigation/SectionNavigatorItem'

import _size from 'lodash/size'
import _orderBy from 'lodash/orderBy'

export default {
  name: 'section-navigator',
  computed: {
    ...mapGetters(['scrollPoints']),
    isVisible() {
      return _size(this.scrollPoints)
    },
    items() {
      return _orderBy(this.scrollPoints, ['sectionTop'])
    }
  },
  components: {
    SectionNavigatorItem
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

#section-navigator-wrapper
  position fixed
  top 280px
  right -240px
  z-index 51
  #section-navigator
    animate()
    background-color $color-primary
    border-top-left-radius 6px
    border-bottom-left-radius 6px
    border alpha(black, 0.1) 1px solid
    position relative
    left 0px
    width 280px
    ul.navigation-items
      cleanlist()
      radius(30px)
    &:hover
      left -240px
    @media(max-width: 900px)
      display none

</style>
