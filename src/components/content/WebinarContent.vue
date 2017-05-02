<template lang="pug">

  .course-content-wrapper(v-bind:class="{ 'active': isActive }")

    .course-content.webinar-content(v-for="content in courseWebinarContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        .pure-button.pure-button-primary.pull-right(v-if="!registered" @click="showAuth") {{ $t('auth.login_to_participate') }}
        .clearfix

      conversation-container(ref="conversationContainer" v-if="registered" v-bind:content-slug="content.slug")

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
    registered() {
      return this.$store.getters.isRegistered;
    },
    currentSection() {
      return this.$store.getters.currentSection;
    },
    isActive() {
      return (typeof this.currentSection != 'undefined' && this.currentSection.label === this.label);
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
      const element = this.$refs.conversationContainer[0].$el;
      _.forEach(this.courseWebinarContent, (content) => {
        this.$store.dispatch('setScrollPoint', {
          label: this.label,
          top: (element.offsetParent.offsetTop + element.offsetTop),
          bottom: (element.offsetParent.offsetTop + element.offsetTop) + element.offsetHeight,
          duration: 10000,
          videoId: content.video,
        });
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
