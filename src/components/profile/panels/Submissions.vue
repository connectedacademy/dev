<template lang="pug">

.profile-panel

  profile-panel-header(v-bind:label="label" v-on:refresh="loadData")

  .profile-panel--content

      .pure-button.pure-button-subtle(v-for="(content, index) in contentSlugs" @click="contentSlug = content.slug" v-bind:class="{ 'active': (contentSlug === content.slug) }") {{ content.title }}

      ul
        li(v-for="submission in submissions")
          a(v-bind:href="submission.original" target="_blank")
            img(v-bind:src="submission.thumbnail")
          p {{ timeStamp(submission.createdAt) }}

</template>

<script>
import { mapGetters } from 'vuex';
import API from '@/api';
import filter from 'lodash/filter';

import Moment from 'moment-mini';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';
import ContentFilter from '@/components/profile/ContentFilter';

import 'vue-awesome/icons/refresh';

export default {
  name: 'submissions',
  props: ['classSlug', 'label'],
  components: {
    ProfilePanelHeader,
    ContentFilter,
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      submissions: [],
      contentSlug: 'homework', //TODO make dynamic
    };
  },
  computed: {
    ...mapGetters(['profileClass', 'profileClassSlug']),
    contentSlugs() {
      if (!this.profileClass) return [];
      return filter(this.profileClass.content, (obj) => {
        return obj.homework;
      })
    },
  },
  methods: {
    timeStamp(timestamp) {
      return Moment(timestamp).format('LTS - ddd M YYYY');
      return Moment(timestamp).fromNow();
    },
    loadData() {

      this.submissions = [];

      API.profile.getSubmissions(
        this.profileClassSlug,
        (response) => {
          this.submissions = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve student list');
          this.submissions = [];
        },
      );
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/buttons'
@import '~stylus/profile'

.profile-panel

  .profile-panel--content

    .pure-button.pure-button-subtle
      display block
      margin-bottom 10px
      &.active
        background $color-border
        color $color-text-dark-grey
    ul
      cleanlist()
      li
        cleanlist()
        border-bottom $color-border 1px solid
        color $color-text-light-grey
        padding 20px 0
        &:first-child
          padding-top 10px
        &:last-child
          border-bottom none
          padding-bottom 0
        p
          reset()
          color $color-text-dark-grey
          font-size .9em
          margin-top 10px
        a
          display block
          text-decoration none
          img
            display block
            width 100%

</style>
