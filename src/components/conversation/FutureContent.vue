<template lang="pug">

.course-content

  .course-content--header

    h1.content-title
      span(v-if="content.content_type === 'class'") {{ `Live class ` }}
      span(v-else) {{ `New content ` }}
      | coming soon

  .course-content--body
    .countdown-wrapper
      h1 {{ releaseIn }}
      h5 {{ releaseAt }}

  .course-content--footer
    .pure-button.pull-right(@click="jumpForwardInTime") Jump forward in time
    .clearfix

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
      let jumpTime = Moment(this.content.release_at);
      jumpTime = jumpTime.add(5, 'minutes').format();
      this.$store.commit('setFauxTime', jumpTime);
      this.$store.dispatch('getCourse');
      this.$store.dispatch('getSpec', this.currentClass.slug);
    },
  },
};
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/shared/common"
@import "../../assets/stylus/layout/course-content"

.course-content

  .course-content--header
    text-align center

  .course-content--body
    text-align center
    .countdown-wrapper
      radius(6px)
      display inline-block
      background-color $color-primary
      margin 10px auto
      padding 10px 30px 20px 30px
      h1, h5
        color white
      h1
        nomargin()
        nopadding()
        margin-bottom 10px
      h5
        nomargin()
        nopadding()
</style>
