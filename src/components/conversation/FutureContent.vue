<template lang="pug">

.course-content

  .course-content--header.block
    h1.content-title {{ `${content.slug} coming soon` }}
    h2.content-subtitle {{ releaseAt }}
    .pure-button(name="circle" @click="jumpForwardInTime") Release Now

</template>

<script>
import {mapGetters} from 'vuex';
import Moment from 'moment-mini';

export default {
  name: 'future-content',
  props: ['content'],
  computed: {
    ...mapGetters(['fauxTime', 'currentClass']),
    releaseIn() {
      return Moment(this.content.release_at).from(this.fauxTime, true);
    },
    releaseAt() {
      return Moment(this.content.release_at).format('MMMM Do YYYY, HH:mm');
    },
    time() {
      return Moment(this.fauxTime).format('MMMM Do YYYY, HH:mm');
    },
  },
  methods: {
    jumpForwardInTime() {
      this.$log.info('this.content');
      this.$log.info(this.content);
      let jumpTime = Moment(this.content.release_at);
      jumpTime = jumpTime.add(2, 'hours').format();
      this.$store.commit('setFauxTime', jumpTime);
      // this.$store.dispatch('getCourse');
      this.$store.dispatch('getSpec', this.currentClass.slug);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'
@import '~stylus/layout/course-content'

.course-content
  position relative

  .course-content--header
    background-color $color-warning !important
    text-align center
    h1.content-title
      color white
      text-transform capitalize
    h2.content-subtitle
      color white
      font-weight normal

  .course-content--body
    background-color transparent
    padding 20px 40px !important
    text-align center
    h1, h2, h5
      reset()
      color white
      padding 5px
    h5
      opacity 0.5

  .pure-button
    background-color transparent
    border white 1px solid
    color white
    margin 10px auto 5px auto
    &:hover
      background-color white
      color $color-warning

</style>
