<template lang="pug">

  .course-content-wrapper(v-bind:class="{ 'active': isActive }")

    .course-content.class-content(ref="classContent" v-for="content in courseClassContent" v-bind:class="{ optional: content.optional }")

      .course-content--header
        h1.content-title {{ content.title }}

      .course-content--body
        p.content-description {{ content.description }}

        video-thumbnail(:video-src="content.video" v-if="content.video" )

      .course-content--footer
        .pure-button.pure-button-primary.pull-right(v-if="!registered" @click="showAuth") {{ $t('common.login_to_participate') }}
        .clearfix

      conversation-container

</template>

<script>
/* eslint-disable */
import _ from 'lodash';
import { mapGetters } from 'vuex';

import * as types from '../../store/mutation-types';
import MarkdownLink from '../MarkdownLink';
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
      // return (this.currentSection.label === this.label);
    },
    ...mapGetters([
      'courseClassContent',
    ]),
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      label: 'classContent',
    };
  },
  methods: {
    setScrollPoints() {
      _.forEach(this.courseClassContent, (content) => {
        this.$store.dispatch('setScrollPoint', { label: this.label, top: this.$refs.classContent[0].offsetTop, bottom: this.$refs.classContent[0].offsetTop + this.$refs.classContent[0].scrollHeight, videoId: content.video });
      });
    },
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

</style>
