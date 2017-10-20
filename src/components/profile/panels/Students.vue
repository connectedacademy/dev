<template lang="pug">

.profile-panel

  profile-panel-header(label="Students in Class" v-on:refresh="loadData")

  .profile-panel--content.no-padding
    //- pre {{ profileClass }}
    //- pre {{ students }}
    student-tile(v-for="(student, index) in students" v-bind:key="index" v-bind:student="student")

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';
import StudentTile from '@/components/profile/tiles/StudentTile';

export default {
  name: 'students',
  props: ['classSlug'],
  components: {
    ProfilePanelHeader,
    StudentTile,
  },
  mounted() {
    this.loadData();
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
      
      API.profile.getStudents(
        this.profileClassSlug,
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

