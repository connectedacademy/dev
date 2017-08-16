<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Student submissions

    .reload-button(@click="loadData")
      icon(name="refresh")

  content-filter(v-bind:classSlug.sync="classSlug" v-bind:contentSlug.sync="contentSlug" v-bind:filter-class="true" v-bind:filter-content="true")

  .admin-panel--content

    ul
      li(v-for="submission in submissions")
        a(v-bind:href="submission.original" target="_blank")
          img(v-bind:src="submission.thumbnail")
        p {{ timeStamp(submission.createdAt) }}

    pre.hidden {{ submissions }}

</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';
import API from '@/api';

import Moment from 'moment';

import ContentFilter from '@/components/admin/ContentFilter';

export default {
  name: 'student-submissions',
  components: {
    ContentFilter,
  },
  mounted() {
    this.loadData();
  },
  watch: {
    classSlug(nV, oV) {
      if (nV !== oV) {
        this.loadData();
      }
    },
    contentSlug(nV, oV) {
      if (nV !== oV) {
        this.loadData();
      }
    },
  },
  data() {
    return {
      submissions: [],
      classSlug: undefined,
      contentSlug: undefined,
    };
  },
  methods: {
    timeStamp(timestamp) {
      return Moment(timestamp).format('LTS - ddd M YYYY');
      return Moment(timestamp).fromNow();
    },
    loadData() {

      this.submissions = [];

      const request = { theClass: this.classSlug, slug: this.contentSlug };

      API.admin.getSubmissions(
        request,
        (response) => {
          this.submissions = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve student list');
          this.submissions = [];
        },
      );
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/admin'

.admin-panel

  .admin-panel--content
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
