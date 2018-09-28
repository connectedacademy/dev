<template lang="pug">
.content-item.liveclass-item(v-if="$route.name === 'content'" :class="{ independent: independent }")
  .content
    h1
      icon(:icon="{ prefix: 'fab', iconName: 'twitter' }" v-if="course.engine === 'twitter'" title="Messages are published on Twitter")
      icon(icon="comment" v-if="course.engine === 'local'" title="Messages are stored on Connected Academy")
      | {{ content.title }}
    p {{ independent ? 'This class has a live twitter based discussion, click below to join it.' : content.description }}
  .scheduled-classes(v-if="content.classes")
    .info-tile(v-for="theClass in content.classes")
      .inner-wrapper
        .info-title {{ theClass.location }}
        .info-subtitle {{ formatDate(theClass.date) }}

  router-link.pure-button.pure-button-transparent.no-margin(:to="{ name: 'live' }")
    | Join Class
  .clearfix
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment-mini'

export default {
  name: 'live-class',
  props: ['content', 'independent'],
  computed: {
    ...mapGetters([
      'course'
    ])
  },
  methods: {
    formatDate(date) {
      return moment(date, 'MM-DD-YYYY HH:mm').format('HH:mm on dddd DD MMMM')
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/action-tile'

.content-item
  &.independent
    margin-top 20px !important
    padding 15px
    .pure-button
      box-sizing()
      max-width none
      width 100%

.scheduled-classes
  display flex
  flex-wrap wrap
  margin 0 -10px 10px -10px
  .info-tile
    box-sizing border-box
    display block
    flex-basis 50%
    padding 10px
    @media(max-width: 760px)
      flex-basis 100%
    .inner-wrapper
      radius(10px)
      border alpha(white, 0.3) 1px solid
      padding 15px 20px
      .info-title
        color white
        font-weight bold
      .info-subtitle
        color white
      .info-action
        color white
        margin 0
        margin-top 10px
</style>
