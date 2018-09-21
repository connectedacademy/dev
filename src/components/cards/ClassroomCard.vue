<template lang="pug">

  .card#classroom-card(v-if="user" v-bind:class="{ visible: visible, active: currentClassroom }")

    p {{ $t('classroom.classroom') }}

    input#classroom-input(v-model="classroomCode" placeholder="7342" v-bind:disabled="currentClassroom")

    a.pure-button.pure-button-action(v-if="currentClassroom" v-on:click="leaveClassroom") {{ $t('classroom.leave_classroom') }}
    a.pure-button.pure-button-action(v-if="!currentClassroom && (classroomCode.length > 2)" v-on:click="joinClassroom") {{ $t('classroom.join_classroom') }}

</template>

<script>
import { mapGetters } from 'vuex'
import API from '@/api'

import find from 'lodash/find'

export default {
  name: 'classroom-card',
  props: ['visible'],
  mounted() {
    this.checkForExistingClassroom()
  },
  data() {
    return {
      currentClassroom: false,
      classroomCode: '',
    }
  },
  computed: {
    ...mapGetters(['currentClass', 'user'])
  },
  methods: {
    checkForExistingClassroom() {
      if (typeof this.$route.params.classSlug === 'undefined') return
      
      const request = {
        theClass: this.$route.params.classSlug
      }
      
      API.classroom.getClassroomStatus(
        request,
        (response) => {
          this.$log.info(response)
          this.currentClassroom = true
          this.classroomCode = response.code
        },
        (response) => {
          this.$log.error(response)
          // TODO: Better handle failed request
        }
      )
    },
    registerAttendance() {

      const postData = { code: this.classroomCode }

      API.classroom.registerAttendance(
        postData,
        (response) => {
          this.$log.info(response)
          this.currentClassroom = true
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to register attendance')
          alert(`${$t('classroom.failed_to_register')} - ${response.body.data}`)
        }
      )
    },
    joinClassroom() {
      this.registerAttendance()
    },
    leaveClassroom() {
      this.currentClassroom = false
    },
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/drawer'

.card#classroom-card
  radius(6px)
  background-color $color-info
  color white
  display block
  margin 0 15px
  padding 15px 0
  text-align center
  // position absolute
  // bottom 15px
  // left 15px
  // right 15px
  // top auto
  &.active
    background-color $color-success
    color white

  .pure-button
    radius(0)
    reset()
    line-height 50px

  p
    reset()
    color inherit
    font-weight bold
    line-height 50px
    padding 0 10px

  input#classroom-input
    animate()
    box-sizing()
    radius(6px)
    placeholderColor(alpha(white, 0.5))
    background-color alpha(black, 0.0)
    border alpha(black, 0.1) 2px dashed
    color inherit
    display inline-block
    font-size 1.6em
    padding 10px
    margin 0 20px 20px 20px
    text-align center
    width calc(100% - 40px)
    outline 0
    /*text-transform uppercase*/
    &.disabled
      background-color transparent

  a.pure-button.pure-button-action
    color inherit

</style>
