<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight }")

  profile-panel-header(v-bind:label="label" v-on:refresh="loadData" can-refresh)

  .profile-panel--content.no-padding
    .no-results(v-if="students.length === 0")
      | No Results
    student-tile(v-for="(student, index) in students" v-bind:key="index" v-bind:student="student" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';
import StudentTile from '@/components/profile/tiles/StudentTile';

export default {
  name: 'students',
  props: ['label', 'classSlug', 'limitHeight', 'role'],
  components: {
    ProfilePanelHeader,
    StudentTile,
  },
  mounted() {
    if (this.expandedView) { this.loadData(); }
    EventBus.$on('profileClassUpdated', () => {
      this.loadData();
    });
  },
  data() {
    return {
      students: [],
    };
  },
  computed: {
    ...mapGetters(['profileClass', 'profileClassSlug']),
  },
  methods: {
    loadData() {
      this.students = [];

      let request = {
        theClass: undefined,
      }
      
      if (this.role === 'teacher') {
        request.theClass = this.profileClassSlug;
      }
      
      API.profile.getStudents(
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

@import '~stylus/profile'

.profile-panel--content
  ul
    cleanlist()
    li
      cleanlist()
      border-bottom $color-lighter-grey 1px solid
      padding 15px 0 15px 60px
      position relative

</style>

