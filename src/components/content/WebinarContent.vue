<template lang="pug">

  .course-content-wrapper(ref="webinarContent" v-bind:class="{ 'active': isActive }")

    .course-content.webinar-content(v-for="content in courseWebinarContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        //- video-thumbnail(:video-src="content.video" v-if="content.video" )

      conversation-container

</template>

<script>
import { mapGetters } from 'vuex';

import MarkdownLink from '../MarkdownLink';
import VideoContainer from '../VideoContainer';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  mounted() {
    this.$store.dispatch('addScrollPoint', { label: this.label, position: this.$refs.webinarContent.offsetTop });
  },
  computed: {
    currentSection() {
      return this.$store.getters.currentSection;
    },
    isActive() {
      return (this.currentSection === this.label);
    },
    ...mapGetters([
      'courseWebinarContent',
    ]),
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      label: 'webinar',
    };
  },
  components: {
    ConversationContainer,
    MarkdownLink,
    VideoContainer,
    VideoThumbnail,
  },
};
</script>

<style lang="stylus" scoped>

@import "../../assets/stylus/layout/course-content"

.course-content-wrapper.active
  .course-content
    background-color green !important

</style>
