<template lang="pug">

.course-content

  .course-content--body
    h1
      span(v-if="content.content_type === 'class'") {{ `Live class ` }}
      span(v-else) {{ `New content ` }}
      | coming soon
    h2 {{ releaseIn }}
    h5 {{ releaseAt }}
    .pure-button(name="circle" @click="jumpForwardInTime") Time Travel

</template>

<script>
import _ from 'lodash';
import * as config from '@/api/config';
import {mapGetters} from 'vuex';
import Moment from 'moment';

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
      this.$log.log('this.content');
      this.$log.log(this.content);
      let jumpTime = Moment(this.content.release_at);
      jumpTime = jumpTime.add(1, 'minutes').format();
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
  background-color transparent !important
  background-color rgba(255,255,255,0.05) !important
  /*border white 2px dashed*/
  position relative

  .course-content--header
    text-align center
    h1.content-title
      color white

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

</style>
