<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Question responses

    .reload-button(@click="loadData")
      icon(name="refresh")

  pre {{ responses }}

  .admin-panel--content
    //- ul
      li(v-for="response in responses")
        pre {{ response }}

</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';
import API from '@/api';

export default {
  name: 'question-responses',
  components: {
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
    };
  },
  methods: {
    loadData() {

      this.responses = [];

      const request = {};

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
