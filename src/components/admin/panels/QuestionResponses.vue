<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Question responses

    .reload-button(@click="loadData")
      icon(name="refresh")

  .admin-panel--content
    ul
      li(v-for="response in responses.during")
        h3 {{ response.question.text }}
        div(v-if="response.question.response_type === 'text'")
          p(v-for="answer in response.answers")
            | {{ answer }}
        div(v-else-if="response.question.response_type === 'boolean'")
          p True : {{ response.totals.true ? response.totals.true : 0 }}
          p False : {{ response.totals.false ? response.totals.false : 0 }}
        div(v-else-if="response.question.response_type === 'scale'")
          p Average : {{ response.mean ? response.mean : 'N/A' }}
        div(v-else)
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
      cleanlist()
      li
        cleanlist()
        border-bottom $color-border 1px solid
        padding 10px 0
        h3
          reset()
          color $color-text-dark-grey
          font-size 1em
          margin-bottom 10px
        p
          reset()
          color $color-text-dark-grey
          font-size 1em

</style>
