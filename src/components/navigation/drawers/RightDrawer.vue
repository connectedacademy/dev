<template lang="pug">

  .drawer#drawer-right(v-bind:class="{ visible: state.visible }")
    .card#profile-container(v-if="user" v-bind:class="{ visible: state.visible }")
      img.user-profile(:src="user.profile")
      h1.user-name {{ user.name }}
      h2.user-account {{ `@${user.account}` }}

      a.pure-button.pure-button-action(v-if="user" v-on:click="logout") {{ $t('auth.logout') }}

    .card#classroom-container(v-if="user" v-bind:class="{ visible: state.visible, active: currentClassroom }")
      input#classroom-input(v-model="classroomCode" v-bind:disabled="currentClassroom || (currentRole === 'teacher')" v-bind:class="{ disabled: currentClassroom || (currentRole === 'teacher') }" placeholder="Class Code")

      ul#role-selector(v-if="!currentClassroom && ((currentRole === 'teacher') || (classroomCode.length <= 2))" @click="toggleRole")
        li(v-bind:class="{ active: (currentRole === 'student') }") Student
        li(v-bind:class="{ active: (currentRole === 'teacher') }") Teacher
        .clearfix

      a.pure-button.pure-button-action(v-if="currentClassroom" v-on:click="leaveClassroom") Leave
      a.pure-button.pure-button-action(v-if="!currentClassroom && (classroomCode.length > 2) && (currentRole === 'student')" v-on:click="joinClassroom") Join Classroom



    .card#settings-container(v-if="user" v-bind:class="{ visible: state.visible }")
      form.pure-form.pure-form-stacked
        fieldset(v-if="user.registration")
          label
            strong {{ $t('common.age') }}
          label {{ `${user.registration.age}` }}
        fieldset(v-if="user.registration")
          label
            strong {{ $t('common.current_language') }}
          label {{ `${user.registration.lang}` }}
        fieldset
          label
            strong {{ $t('common.current_service') }}
          label {{ `${user.service}` }}
        fieldset(v-if="user.registration")
          label
            strong {{ $t('common.current_hub') }}
          label {{ `${user.registration.hub_id}` }}

      a.pure-button.pure-button-action(v-if="user") Edit Profile

</template>

<script>
import {mapGetters} from 'vuex';
import * as types from '@/store/mutation-types';
import API from '@/api';

export default {
  name: 'right-drawer',
  methods: {
    toggleRightDrawer() {
      this.$store.commit(types.TOGGLE_RIGHT_DRAWER);
    },
    logout() {
      this.toggleRightDrawer();
      this.$store.dispatch('logout');
    },
    toggleRole() {
      this.role = (this.currentRole === 'teacher') ? 'Student' : 'Teacher';

      switch (this.currentRole) {
        case 'teacher':

          this.classroomCode = 'loading';

          const request = { theClass: this.currentClass.slug, slug: 'undefined' };

          API.classroom.getTeacherCode(
            request,
            (response) => {
              this.$log.log(response);
              this.classroomCode = response.code;
            },
            (response) => {
              // TODO: Handle failed request
              this.$log.log('Failed to retrieve teacher code');
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
          this.$log.log(response);
          this.currentClassroom = true;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log('Failed to register attendance');
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
  },
  data() {
    return {
      visible: false,
      currentClassroom: false,
      classroomCode: '',
      role: 'Student',
    };
  },
  computed: {
    ...mapGetters(['currentClass']),
    currentRole() {
      return this.role.toLowerCase();
    },
    user() {
      return this.$store.state.auth.user;
    },
    state() {
      return this.$store.state.navigation.rightDrawer;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

// Profile container
.card

  .pure-button.pure-button-action
    background-color alpha(black, 0.1)
    border-color transparent
    color white
    display block
    margin-top 10px
    &:hover
      background-color alpha(black, 0.2)

  // Profile container
  &#profile-container
    padding 15px
    text-align center
    img.user-profile
      radius(50%)
      height 60px
      width 60px
    h1.user-name
      reset()
      color white
      font-size 1.3em
      font-weight normal
    h2.user-account
      reset()
      color alpha(white, 0.8)
      font-size 1em
      font-weight normal

  // Classroom container
  &#classroom-container
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
      box-sizing border-box
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

  // Settings container
  &#settings-container
    padding 15px
    fieldset
      padding 5px
      label
        color white
        margin-bottom 5px
      select
        width 100%
</style>
