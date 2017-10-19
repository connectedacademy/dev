<template lang="pug">

  .card#classroom-card(v-if="user" v-bind:class="{ visible: visible, active: currentClassroom }")

    ul#role-selector
      li(v-bind:class="{ active: (currentRole === 'student') }" @click="toggleRole('student')") Student
      li(v-bind:class="{ active: (currentRole === 'teacher') }" @click="toggleRole('teacher')") Teacher
      .clearfix

    input#classroom-input(v-model="classroomCode" v-bind:disabled="currentClassroom || (currentRole === 'teacher')" v-bind:class="{ disabled: currentClassroom || (currentRole === 'teacher') }" placeholder="Enter Class Code")

    a.pure-button.pure-button-action(v-if="currentClassroom" v-on:click="leaveClassroom") Leave Classroom
    a.pure-button.pure-button-action(v-if="!currentClassroom && (classroomCode.length > 2) && (currentRole === 'student')" v-on:click="joinClassroom") Join Classroom
    
    li.pure-button.pure-button-action(v-if="currentRole === 'teacher' && (studentsCount > 0)" @click="navigateTo('/profile')") View Classroom

</template>

<script>
import {mapGetters} from 'vuex';
import API from '@/api';

import find from 'lodash/find';

export default {
  name: 'classroom-card',
  props: ['visible'],
  data() {
    return {
      currentClassroom: false,
      classroomCode: '',
      role: 'Student',
      studentsCount: 0,
    };
  },
  computed: {
    ...mapGetters(['currentClass']),
    user() {
      return this.$store.state.auth.user;
    },
    currentRole() {
      return this.role.toLowerCase();
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    navigateTo(toLink) {
      this.$router.push(toLink);
      this.$store.commit('TOGGLE_RIGHT_DRAWER');
    },
    toggleRole(newRole) {
      if (this.currentClassroom) return;

      this.role = newRole;

      switch (this.currentRole) {
        case 'teacher':

          this.classroomCode = '-';

          API.classroom.getTeacherCode(
            this.currentClass.slug,
            (response) => {
              this.$log.info(response);
              this.classroomCode = response.code;
              this.studentsCount = response.students;
            },
            (response) => {
              // TODO: Handle failed request
              this.$log.info('Failed to retrieve teacher code');
            },
          );

          break;
        case 'student':

          this.classroomCode = '';

          break;
        default:
      }
    },
    registerAttendance() {

      const postData = { theClass: this.currentClass.slug, slug: 'undefined', code: this.classroomCode };

      API.classroom.registerAttendance(
        postData,
        (response) => {
          this.$log.info(response);
          this.currentClassroom = true;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to register attendance');
          alert(`Failed to register attendance - ${response.body.data}`);
        },
      );
    },
    joinClassroom() {
      this.registerAttendance();
    },
    leaveClassroom() {
      this.currentClassroom = false;
    },
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/drawer'

.card#classroom-card
  background-color #4590D8
  padding 0
  text-align center
  &.active
    background-color $color-success

  img
    height 60px
    margin-bottom 10px

  .pure-button
    radius(0)
    reset()
    line-height 50px

  ul#role-selector
    cleanlist()
    li
      cleanlist()
      background-color alpha(black, 0.2)
      color alpha(white, 0.3)
      float left
      line-height 50px
      width 50%
      &:hover
        cursor pointer
      &.active
        background-color transparent
        color white
        cursor default
        font-weight bold

  input#classroom-input
    animate()
    box-sizing()
    radius(6px)
    placeholderColor(alpha(white, 0.5))
    background-color alpha(black, 0.0)
    border alpha(black, 0.1) 2px dashed
    color white
    display inline-block
    font-size 1.6em
    padding 10px
    margin 20px 20px 16px 20px
    text-align center
    width calc(100% - 40px)
    outline 0
    /*text-transform uppercase*/
    &.disabled
      background-color transparent

</style>
