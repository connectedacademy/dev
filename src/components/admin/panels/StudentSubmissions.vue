<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Student submissions

    .reload-button(@click="reloadClass")
      icon(name="refresh")

  .admin-panel--content

      .pure-button.pure-button-subtle(v-for="(content, index) in contentSlugs" @click="contentSlug = content.slug") {{ content.title }}

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

import ContentFilter from '@/components/admin/ContentFilter';

import 'vue-awesome/icons/refresh';

export default {
  name: 'student-submissions',
  props: ['classSlug'],
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
      contentSlug: undefined,
    };
  },
  computed: {
    ...mapGetters(['course', 'currentClass']),
    contentSlugs() {
      if (!this.currentClass) return [];
      return filter(this.currentClass.content, (obj) => {
        return obj.homework;
      })
    },
  },
  methods: {
    timeStamp(timestamp) {
      return Moment(timestamp).format('LTS - ddd M YYYY');
      return Moment(timestamp).fromNow();
    },
    reloadClass() {
      this.$store.dispatch('getSpec', this.classSlug);
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
          this.$log.info('Failed to retrieve student list');
          this.submissions = [];
        },
      );
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/admin'

.admin-panel

  .admin-panel--content

    .pure-button.pure-button-subtle
      display block
      margin-bottom 10px
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
