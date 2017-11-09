<template lang="pug">

  .card#classroom-card(v-if="user" v-bind:class="{ visible: visible, active: currentClassroom }")

    h3 Join Classroom

    p Enter teacher code below

    input#classroom-input(v-model="classroomCode" placeholder="")

    a.pure-button.pure-button-action(v-if="currentClassroom" v-on:click="leaveClassroom") Leave Classroom
    a.pure-button.pure-button-action(v-if="!currentClassroom && (classroomCode.length > 2)" v-on:click="joinClassroom") Join Classroom

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
    };
  },
  computed: {
    ...mapGetters(['currentClass']),
    user() {
      return this.$store.state.auth.user;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    registerAttendance() {

      const postData = { code: this.classroomCode };

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

  .pure-button
    radius(0)
    reset()
    line-height 50px

  h3
    cleanlist()
    background-color transparent
    border alpha(black, 0.1) 1px solid
    color white
    cursor default
    font-weight bold
    line-height 50px

  p
    reset()
    color white
    padding 20px 10px 0px 10px

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
