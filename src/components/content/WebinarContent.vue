<template lang="pug">

  .course-content-wrapper(v-bind:class="{ 'active': isActive }")

    .course-content.webinar-content(ref="webinarContent" v-for="content in courseWebinarContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        .pure-button.pure-button-primary.pull-right(v-if="!registered" @click="showAuth") {{ $t('common.login_to_participate') }}

      conversation-container

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';

import MarkdownLink from '../MarkdownLink';
import VideoContainer from '../VideoContainer';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  mounted() {
    this.setScrollPoints();
  },
  computed: {
    currentSection() {
      return this.$store.getters.currentSection;
    },
    isActive() {
      return (typeof this.currentSection != 'undefined' && this.currentSection.label === this.label);
      // return (this.currentSection.label === this.label);
    },
    ...mapGetters([
      'courseWebinarContent',
    ]),
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      label: 'webinarContent',
    };
  },
  methods: {
    setScrollPoints() {
      console.log(this.$refs);
      _.forEach(this.courseWebinarContent, (content) => {
        this.$store.dispatch('setScrollPoint', { label: this.label, top: this.$refs.webinarContent[0].offsetTop, bottom: this.$refs.webinarContent[0].offsetTop + this.$refs.webinarContent[0].scrollHeight, videoId: content.video });
      });
    },
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
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

</style>
