<template lang="pug">

  .card#classroom-card(v-if="user" v-bind:class="{ visible: visible, active: currentClassroom }")
    input#classroom-input(v-model="classroomCode" v-bind:disabled="currentClassroom || (currentRole === 'teacher')" v-bind:class="{ disabled: currentClassroom || (currentRole === 'teacher') }" placeholder="Class Code")

    ul#role-selector(v-if="!currentClassroom && ((currentRole === 'teacher') || (classroomCode.length <= 2))" @click="toggleRole")
      li(v-bind:class="{ active: (currentRole === 'student') }") Student
      li(v-bind:class="{ active: (currentRole === 'teacher') }") Teacher
      .clearfix

    a.pure-button.pure-button-action(v-if="currentClassroom" v-on:click="leaveClassroom") Leave
    a.pure-button.pure-button-action(v-if="!currentClassroom && (classroomCode.length > 2) && (currentRole === 'student')" v-on:click="joinClassroom") Join Classroom

</template>

<script>
import {mapGetters} from 'vuex';
import API from '@/api';

export default {
  name: 'classroom-card',
  props: ['visible'],
  data() {
    return {
      currentClassroom: false,
      classroomCode: '',
      role: 'Student',
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
    toggleRole() {
      this.role = (this.currentRole === 'teacher') ? 'Student' : 'Teacher';

      switch (this.currentRole) {
        case 'teacher':

          this.classroomCode = 'loading';
          
          const classroomSlug = _.find(this.currentClass.content, (o) => {
            return (o.content_type === 'class');
          }).slug;

          alert(classroomSlug);

          const request = { theClass: this.currentClass.slug, slug: classroomSlug };

          API.classroom.getTeacherCode(
            request,
            (response) => {
              this.$log.info(response);
              this.classroomCode = response.code;
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
@import '~stylus/drawer'

.card#classroom-card
  background-color #4590D8
  padding 15px
  text-align center
  &.active
    background-color $color-success

  img
    height 60px
    margin-bottom 10px

  .pure-button
    line-height 24px

  ul#role-selector
    cleanlist()
    radius(6px)
    border alpha(black, 0.1) 1px solid
    margin-top 10px
    li
      cleanlist()
      background-color alpha(black, 0.1)
      color alpha(white, 0.6)
      float left
      line-height 40px
      width 50%
      &:hover
        cursor pointer
      &.active
        background-color transparent
        color white
        cursor default

  input#classroom-input
    animate()
    radius(6px)
    placeholderColor(alpha(white, 0.5))
    background-color alpha(black, 0.0)
    border alpha(black, 0.1) 2px dashed
    box-sizing()
    color white
    display block
    font-size 1.6em
    padding 10px
    text-align center
    width 100%
    outline 0
    /*text-transform uppercase*/
    &.disabled
      background-color transparent
      border-color transparent

</style>
