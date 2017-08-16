<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Students on course

    .reload-button(@click="loadData")
      icon(name="refresh")

  .admin-panel--content.no-padding
    ul
      li(v-for="student in students" v-if="student.user")
        student-tile(v-bind:student="student")


</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';
import API from '@/api';

import StudentTile from '@/components/admin/tiles/StudentTile';

export default {
  name: 'course-students',
  components: {
    StudentTile,
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
      students: [],
    };
  },
  computed: {
    ...mapGetters(['currentClass']),
  },
  methods: {
    loadData() {

      this.students = [];

      const request = {};

      API.admin.getCourseUsers(
        request,
        (response) => {
          this.students = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to retrieve student list');
          this.students = [];
        },
      );
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/admin'

.admin-panel--content
  ul
    cleanlist()
    li
      cleanlist()
      border-bottom $color-lighter-grey 1px solid
      padding 15px 15px 15px 70px
      position relative

</style>
