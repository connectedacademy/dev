<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Students in class

    .reload-button(@click="loadData")
      icon(name="refresh")

  content-filter(v-bind:classSlug.sync="classSlug" v-bind:filter-class="true" v-bind:filter-content="false")

  .admin-panel--content.no-padding
    ul
      li(v-for="student in students" v-if="student.user")
        student-tile(v-bind:student="student")

</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';
import API from '@/api';

import ContentFilter from '@/components/admin/ContentFilter';
import StudentTile from '@/components/admin/tiles/StudentTile';

export default {
  name: 'class-students',
  components: {
    ContentFilter,
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
  },
  data() {
    return {
      students: [],
      classSlugs: ['intro', 'evidence', 'something'],
      contentSlugs: ['undefined', 'liveclass', 'webinar'],
      classSlug: 'intro',
    };
  },
  computed: {
    ...mapGetters(['currentClass']),
  },
  methods: {
    loadData() {

      this.students = [];

      const request = { theClass: this.classSlug };

      API.classroom.getClassroomUsers(
        request,
        (response) => {
          this.students = response;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve student list');
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
      padding 15px 0 15px 60px
      position relative
      img.student--profile
        radius(50%)
        height 50px
        width 50px
        position absolute
        top 10px
        left 0
      .student--name
        color $color-text-dark-grey
        line-height 25px
      .student--email
        color $color-text-light-grey
        line-height 15px

</style>
