<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Question responses

    .reload-button(@click="loadData")
      icon(name="refresh")

  content-filter(v-bind:classSlug.sync="classSlug" v-bind:contentSlug.sync="contentSlug" )

  .admin-panel--content

    ul
      li(v-for="response in responses")
        pre {{ response }}

</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';
import API from '@/api';

import ContentFilter from '@/components/admin/ContentFilter';

export default {
  name: 'question-responses',
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
      responses: [],
      classSlugs: ['evidence', 'something'],
      contentSlugs: ['undefined', 'liveclass', 'webinar', 'intro'],
      classSlug: undefined,
      contentSlug: undefined,
    };
  },
  methods: {
    loadData() {

      this.responses = [];

      const request = { theClass: this.classSlug, slug: this.contentSlug };

      API.analytics.getQuestionResponses(
        request,
        (response) => {
          this.responses = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve question responses');
          this.responses = [];
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
      li
        color $color-text-light-grey

</style>
