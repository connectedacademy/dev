<template lang="pug">

  .course-content-wrapper(ref="classContent" v-bind:class="{ 'active': isActive }")

    .course-content.class-content(v-for="content in courseClassContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        .pure-button.pure-button-primary.pull-right(v-if="!registered" @click="showAuth") Login to Participate
        .clearfix

      conversation-container

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import * as types from '../../store/mutation-types';
import MarkdownLink from '../MarkdownLink';
import VideoThumbnail from '../VideoThumbnail';
import ConversationContainer from '../ConversationContainer';

export default {
  name: 'class-content',
  mounted() {
    _.forEach(this.courseClassContent, (content) => {
      this.$store.dispatch('addScrollPoint', { label: this.label, position: this.$refs.classContent.offsetTop, videoId: content.video });
    });
  },
  computed: {
    registered() {
      return this.$store.getters.isRegistered;
    },
    currentSection() {
      return this.$store.getters.currentSection;
    },
    isActive() {
      return (this.currentSection === this.label);
    },
    ...mapGetters([
      'courseClassContent',
    ]),
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      label: 'class',
    };
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
  },
  components: {
    ConversationContainer,
    MarkdownLink,
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
