<template lang="pug">

  .course-content-wrapper
    .course-content.webinar-content(v-for="content in courseWebinarContent")
      h1 {{ content.title }}

      video-container(:video-src="content.video")

      .msg-container
        .msg.visible(v-for="msg in msgs()" v-bind:style="{ top: msg.position + 'px' }")
          p
            strong {{ msg.username }}
          p {{ ' ' + msg.text }}

</template>

<script>
import { mapGetters } from 'vuex';

import VideoContainer from '../VideoContainer';

export default {
  name: 'class-content',
  props: ['content'],
  computed: {
    ...mapGetters([
      'courseWebinarContent',
    ]),
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      scrollPosition: 0,
      msgs() {
        const msgHeight = 90;
        let i = 0;
        let msgs = [];
        while (i < 10) {
          msgs.push({
            username: '@username',
            text: `Test msg ${Math.ceil(this.scrollPosition * i)} #hashtag`,
            position: 0, // + ((i - 5) * 40) + (this.scrollPosition * 100),
          });
          i += 1;
        }
        const minAllowable = (msgs.length < 20) ? msgs.length : 20;
        msgs = msgs.slice(msgs.length - minAllowable, msgs.length);
        return msgs;
      },
    };
  },
  components: {
    VideoContainer,
  },
};
</script>

<style lang="stylus">

@import "../../assets/stylus/layout/course-content"

</style>
