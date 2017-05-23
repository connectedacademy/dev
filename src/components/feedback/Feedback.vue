<template lang="pug">

  .col#col-main.background-white(v-bind:class="this.$store.state.layout.columns.main.state")

    previous-button

    .container

      info-dialogue(:dismissable="true")
        p You are currently viewing submissions for the '{{ contentSlug }}' section of the {{ classSlug }} class

      .feedback-section(v-if="feedbackItems.length > 0")

        h1.feedback-section-title Your Peer Feedback
        h5.feedback-section-subtitle Please provide feedback on the following images

        .pure-g

          .pure-u-1-3(v-for="feedbackItem in feedbackItems")

            feedback-tile(v-bind:content="feedbackItem")

      .feedback-section(v-if="availableFeedbackItems.length > 0")

        h1.feedback-section-title Provide Feedback
        h5.feedback-section-subtitle Select any of the following images to add it to your list

        .pure-g

          .pure-u-1-3(v-for="feedbackItem in availableFeedbackItems")

            feedback-tile(v-bind:content="feedbackItem")

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import API from '@/api';
import * as types from '@/store/mutation-types';

import PreviousButton from '../PreviousButton';
import FeedbackTile from './FeedbackTile';
import InfoDialogue from '../InfoDialogue';

export default {
  name: 'feedback',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.dispatch('checkAuth');
    });
  },
  created() {
    // Check if user has registered
    if (this.isAuthenticated && !this.isRegistered) {
      this.$router.push('/registration');
    }
  },
  mounted() {
    this.$store.dispatch('setColumnState', 'narrow');

    // Fetch feedback items
    this.getFeedbackItems();
    this.getAvailableFeedbackItems();
  },
  data() {
    return {
      navTitle: 'Connected Academy - Feedback',
      feedbackItems: [],
      availableFeedbackItems: [],
    };
  },
  methods: {
    getFeedbackItems() {
      const request = { class: this.classSlug, content: this.contentSlug };
      API.feedback.getFeedbackItems(
        request,
        (response) => {
          this.$log.log('Response from feedback request');
          this.$log.log(response);
          this.feedbackItems = response.data;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve feedback');
        },
      );
    },
    getAvailableFeedbackItems() {
      const request = { class: this.classSlug, content: this.contentSlug };
      API.feedback.getAvailableFeedbackItems(
        request,
        (response) => {
          this.$log.log('Response from feedback request');
          this.$log.log(response);
          this.availableFeedbackItems = response.data;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve feedback');
        },
      );
    },
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered',
    ]),
    classSlug() {
      return this.$route.params.classSlug;
    },
    contentSlug() {
      return this.$route.params.contentSlug;
    },
    feedbackItems() {
      return this.feedbackItems;
    },
    availableFeedbackItems() {
      return this.availableFeedbackItems;
    },
  },
  components: {
    PreviousButton,
    InfoDialogue,
    FeedbackTile,
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared/*'

.feedback-section
  margin-bottom 30px
  h1.feedback-section-title
    nomargin()
    nopadding()
    padding 0 10px
  h5.feedback-section-subtitle
    nomargin()
    nopadding()
    color $color-text-grey
    padding 0 10px
    margin-bottom 10px

</style>
