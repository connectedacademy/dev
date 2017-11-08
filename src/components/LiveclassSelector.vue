<template lang="pug">
  .liveclass-selector
    ul.liveclass-list
      li.liveclass-list-item(v-for="(hub, index) in hubs" v-bind:key="index" v-bind:class="{ selected: currentValue && (hub.id === currentValue.id) }" @click="selectHub(hub)")
        .liveclass-list-item--location
          | {{ `Held in ${hub.name}` }}
        .liveclass-list-item--time
          | {{ releaseTime(hub.liveclass_release) }}
        .liveclass-list-item--date
          | {{ releaseDate(hub.liveclass_release) }}
      .clearfix

</template>

<script>
import { mapGetters } from 'vuex'
import Moment from 'moment-mini';

export default {
  name: 'liveclass-selector',
  props: ['value'],
  mounted() {
    this.$store.dispatch('getHubs');
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  computed: {
    ...mapGetters (['hubs'])
  },
  methods: {
    releaseDate(date) {
      return Moment(date).format('MMM Do YYYY')
    },
    releaseTime(date) {
      return Moment(date).format('HH:mm')
    },
    selectHub(hub) {
      this.currentValue = hub
      this.$emit('input', hub.id)
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.liveclass-selector
  margin 20px auto
  ul.liveclass-list
    cleanlist()
    li.liveclass-list-item
      cleanlist()
      box-sizing()
      animate()
      background-color $color-lighter-grey
      border-left darken($color-lighter-grey, 10%) 5px solid
      color $color-darkest-grey
      display block
      float left
      height 130px
      margin 10px
      width calc(calc(100% / 2) - 20px)
      padding 30px 30px
      position relative
      text-align left
      &:hover
        cursor pointer
        background-color lighten($color-lighter-grey, 5%)
      .liveclass-list-item--location
        animate()
        color inherit
        font-size 0.9em
        font-weight bold
        opacity 0
        position absolute
        top 10px
        right 10px
      .liveclass-list-item--time
        animate()
        color inherit
        font-size 2.2em
        font-weight bold
      .liveclass-list-item--date
        animate()
        color inherit
        font-size 1.3em
        font-weight bold
        margin-top -5px
        opacity 0.5
      &.selected
        background-color $color-info
        color white
        border-left-color darken($color-info, 10%)
        .liveclass-list-item--location
          opacity 1.0
        .liveclass-list-item--date
          opacity 1.0
  
</style>
