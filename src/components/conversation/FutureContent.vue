<template lang="pug">

.course-content

  .course-content--header

    h1.content-title
      span(v-if="content.content_type === 'class'") {{ `Live class ` }}
      span(v-else) {{ `New content ` }}
      | coming soon

  .course-content--body
    p.content-description This content will drop soon, you better start getting ready.

    p.content-description This content will be live in {{ releaseAt }}

  .course-content--footer
    .pure-button.pull-right Notify Me
    .clearfix

</template>

<script>
import _ from 'lodash';
import Moment from 'moment';

export default {
  name: 'future-content',
  props: ['content'],
  computed: {
    releaseAt() {
      let currentTime = Moment();
      currentTime.add(10, 'days');
      return Moment(this.content.release_at).from(currentTime);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

</style>
