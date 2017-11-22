<template lang="pug">
  .home-page

    .row#header-row
      .fixed-width
        .col.text-left
          #brand
            h2 Connected Academy
        .col.text-right
          #partnership
            h5 A project by
            h1 Newcastle University
        .clearfix

    .row#image-row
      .fixed-width
        img(src="../../assets/images/generic/desk.jpg")
        img(src="../../assets/images/generic/tablet.jpg")
        img(src="../../assets/images/generic/reading.jpg")

    .row#info-row
      .fixed-width
        .col
          .tile.padded-tile(style="padding-left: 20px")
            h1 {{ course.title }}
            h3.subtle {{ courseStart }}
            p {{ course.description }}
        .col
          .tile.padded-tile.primary-tile#interest-tile
            h2 Register your interest
            p Drop your email in the box below and we will keep you updated on the course.
            form(v-bind:class="{ active: (email.length > 0) }" action="" method="post" target="_blank")
              input(v-model="email" placeholder="Your email address" type="email" name="EMAIL" required)
              button(type="submit") Submit
              .clearfix
        .clearfix

    .row#text-row
      .fixed-width
        .tile.padded-tile.primary-tile
          h2 Join the Course
          p The course is now available, dive in by clicking the button below.
          router-link.button(v-bind:to="{ name: 'schedule' }") Get Started

</template>

<script>
import { mapGetters } from 'vuex'
import PageStyle from '@/mixins/PageStyle'

import Moment from 'moment-mini'

export default {
  name: 'home-page',
  mixins: [ PageStyle ],
  data() {
    return {
      pageStyle: { type: 'home', visible: false, minimized: true },
      email: ''
    }
  },
  computed: {
    ...mapGetters(['course']),
    courseStart() {
      return Moment(this.course.starts).format('dddd, MMMM Do YYYY')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'

// Common
.clearfix
  clear both
  float none

.text-left
  text-align left

.text-right
  text-align right

.text-center
  text-align center

// Layout
.abstract-background
  background-image url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMCIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMzY2IDc2OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTM2NiA3Njg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7b3BhY2l0eTowLjA1O30KCS5zdDF7b3BhY2l0eTowO30KPC9zdHlsZT4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSI1NDcuOCwzNjIuOCA0OTguOSwyMTYuOSAxMDQ3LjUsMjQ1LjUgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNTQ3LjgsMzYyLjggNzM0LjksNTQ2LjcgMTA0Ny41LDI0NS41ICIvPgo8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjExNzQuMiwzOTYuMSA3MzQuOSw1NDYuNyAxMDQ3LjUsMjQ1LjUgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMTE3NC4yLDM5Ni4xIDczNC45LDU0Ni43IDY4NS4zLDc2OCAiLz4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIxMTc0LjIsMzk2LjEgMTA1Ni41LDYzMC45IDY4NS4zLDc2OCAiLz4KPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMTc0LjIsMzk2LjEgMTA1Ni41LDYzMC45IDEzNjYsNjc3LjIgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMTE3NC4yLDM5Ni4xIDEzNjYsMjU2IDEzNjYsNjc3LjIgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMTE3NC4yLDM5Ni4xIDEzNjYsMjU2IDEwNDcuNSwyNDUuNSAiLz4KPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSI5OTguMiwwIDEzNjYsMjU2IDEwNDcuNSwyNDUuNSAiLz4KPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSI5OTguMiwwIDY3My4yLDIyNiAxMDQ3LjUsMjQ1LjUgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNTQ3LjgsMzYyLjggNDk4LjksMjE2LjkgMzI5LjYsMjA4LjEgMjU3LjQsMzMyICIvPgo8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjI5NC40LDQ0LjYgNDM1LjIsMjcuMSAyNTcuNCwzMzIgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iNDUxLDAgMzI5LjYsMjA4LjEgNjczLjIsMjI2IDk5OC4yLDAgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNTQ3LjgsMzYyLjggNzM0LjksNTQ2LjcgNDY2LDY5OC42ICIvPgo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjU0Ny44LDM2Mi44IDI1Ny40LDMzMiA0NjYsNjk4LjYgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMCw0MTYuMiAyNTcuNCwzMzIgNDY2LDY5OC42ICIvPgo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjAsNDE2LjIgMjU3LjQsMzMyIDI5NC40LDQ0LjYgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNjg1LjMsNzY4IDczNC45LDU0Ni43IDQ2Niw2OTguNiAiLz4KPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxMzY2LDY3Ny4yIDEwNTYuNSw2MzAuOSA2ODUuMyw3NjggIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMCw0MTYuNiA3Ny40LDY5OSA0NjYsNjk5ICIvPgo8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjAsNDE2LjIgMCwwIDI5NC40LDQ0LjYgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iNDUxLDAgMCwwIDI5NC40LDQ0LjYgNDM1LjIsMjcuMSAiLz4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSI5OTguMiwwIDEzNjYsMjU2IDEzNjYsMCAiLz4KPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIwLDQxNi42IDc3LjQsNjk5IDAsNzY4ICIvPgo8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjAsNzY4IDc3LjQsNjk5IDQ2Niw2OTkgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMCw3NjggNjg1LjMsNzY4IDQ2Niw2OTkgIi8+Cjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMTM2Niw2NzcuMiAxMzY2LDc2OCA2ODUuMyw3NjggIi8+Cjwvc3ZnPgo=')
  background-position right
  background-size cover
  height 0
  padding-bottom 800px
  position absolute
  top -50%
  bottom -50%
  left -30%
  right 0
  z-index -1
  width 100%
.row
  margin-top 30px
  position relative
  .fixed-width
    margin 0 auto
    max-width 960px
    position relative
  .col
    float left
    width 50%
    &.col-4
      width calc(100% / 3)

  @media(max-width: 568px)
    .col, .col-4
      width 100% 

// Tiles
.tile
  background-color white
  box-sizing border-box
  &.padded-tile
    padding 50px
  &.darkest-grey-tile
    background-color $color-darkest-grey
    color white
  &.grey-tile
    background-color $color-grey
    color white
  &.primary-tile
    background-color $color-primary
    color white
  &.white-tile
    background-color white
    color $color-darkest-grey
    h1, h2, h3, h4, h5
      &.subtle
        color $color-text-grey
  h1, h2, h3, h4, h5
    margin 0
    padding 0

// Page
.home-page
  max-width 100%
  overflow hidden
  padding-bottom 100px
  a#brand-label
    background-color $color-primary
    bottom 0
    color white
    font-weight bold
    padding 0
    position fixed
    right 50px
    text-decoration none
    z-index 50
    img
      height 44px
    
// Header Row
.row#header-row
  height 100px
  margin 0
  .col
    width 50% !important
  #brand
    padding 20px 40px
  #partnership
    padding 40px
    h1, h5
      margin 0
      padding 0
    h5
      line-height 10px
      font-size 0.7em
    h1
      line-height 30px
      font-size 1.0em

// Image Row
.row#image-row
  .fixed-width
    height 400px
    position relative
    @media(max-width: 568px)
      height 250px
      img
        max-height 250px
    img
      background-color $color-darkest-grey
      max-height 300px
      width 50%
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%) rotate(-5deg)
      &:nth-child(1)
        transform translate(-160%, -50%) rotate(-5deg)
      &:nth-child(2)
        transform translate(60%, -50%) rotate(-5deg)

// Text Row
.row#text-row
  .button
    background-color white
    border none
    color $color-primary
    display inline-block
    margin-top 20px
    padding 10px 30px
    text-decoration none

// Stats Row
.row#stats-row
  margin-top 20px
  .fixed-width
    max-width 980px
  .col
    padding 0 10px
    @media(max-width: 568px)
      padding 0 20px
      width 100% 
    .stat-tile
      @media(max-width: 568px)
        margin-bottom 20px

// Tiles
#interest-tile
  form
    overflow hidden
    position relative
    input
      background-color darken($color-primary, 10%)
      border none
      box-sizing border-box
      color white
      font-size 1.1em
      outline 0
      line-height 20px
      padding 20px
      padding-right 110px
      width 100%
      &::-webkit-input-placeholder
        color alpha(white, 0.5)
      &::-moz-placeholder
        color alpha(white, 0.5)
      &:-ms-input-placeholder
        color alpha(white, 0.5)
      &:-moz-placeholder
        color alpha(white, 0.5)
    button[type="submit"]
      animate()
      background-color darken($color-primary, 10%)
      border none
      border-left $color-primary 2px solid
      border-radius 0px
      color white
      font-size 1.1em
      float right
      line-height 60px
      outline 0
      padding 0 20px
      position absolute
      right -110px
      top 0
      width 110px
      text-align center
      &:hover
        background-color darken($color-primary, 20%)
        cursor pointer
    &.active
      button[type="submit"]
        right 0
</style>
