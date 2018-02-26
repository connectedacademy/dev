<template lang="pug">

.profile-panel.no-header

  .profile-panel--content
    img#user-avatar(v-bind:src="profileImage" height="50px")

    h3 {{ user.name }}

    //- pre {{ user }}
    
    //- h3 Roles
    tag-list(v-bind:tags="userRoles")

    .clearfix

    #admin-mode-button.pure-button.pure-button-subtle.pure-button-small(@click="toggleAdminView" v-bind:class="{ active: adminView }") Admin View
    
    .clearfix

    //- h3 Linked Accounts
    //- tag-list(v-bind:tags="[{ label: user.account, link: user.link }]" linked)
    
    h3 Class Code
    .pure-button.pure-button-info.full-width.no-margin#generate-code(v-if="classrooms.length === 0" @click.once="generateCode")
      | Generate Teacher Code
    .classroom-tile(v-else v-for="(classroom, index) in classrooms" v-bind:key="index")
      //- pre {{ classroom }}
      .code {{ classroom.code }}
      .teacher(v-if="classroom.teacher && classroom.teacher.name") {{ classroom.teacher.name }}
      //- pre {{ classroom }}

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import ActionSelector from '@/components/profile/ActionSelector'
import TagList from '@/components/shared/TagList'

import _find from 'lodash/find'
import _filter from 'lodash/filter'

export default {
  name: 'user',
  props: ['label', 'adminView'],
  components: {
    ActionSelector,
    TagList,
  },
  mounted() {
    this.getClassrooms()
    EventBus.$on('profileClassUpdated', () => {
      this.getClassrooms()
    })
  },
  data() {
    return {
      classrooms: []
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug']),
    userRoles() {
      return this.user.roles
    },
    profileImage() {
      return (this.user && this.user.profile) ? this.user.profile.replace('_normal', '') : ''
    },
    proseLink() {
      return 'http://prose.io/#connectedacademy'
    },
    storifyLink() {
      return 'https://storify.com'
    }
  },
  methods: {
    toggleAdminView() {
      this.$emit('update:adminView', !this.adminView)
    },
    getClassrooms() {
      this.classrooms = []

      API.teacher.getClassrooms(
        this.profileClassSlug,
        (response) => {
          this.$log.info(response)
          this.classrooms = response
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to get classrooms')
          this.classrooms = []
        }
      )
    },
    generateCode() {
      API.classroom.getTeacherCode(
        this.profileClassSlug,
        (response) => {
          this.$log.info(response)
          this.getClassrooms()
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to get teacher code')
        }
      )
    }
  }
}
</script>

<style lang="stylus" scoped>
  
@import '~stylus/profile'
@import '~stylus/buttons'

.profile-panel
  .profile-panel--content
    padding 15px
    text-align center
    img#user-avatar
      radius(50%)
      height 80px
      margin-top 20px
      width 80px

    .classroom-tile
      radius(6px)
      background $color-darkest-grey
      color white
      margin-bottom 10px
      padding 5px
      &:last-child
        margin-bottom 0
      .code
        font-weight bold
        margin 5px
      .teacher
        font-weight normal
        margin 5px

#admin-mode-button
  margin-top 10px
  &.active
    background-color $color-success
    border-color $color-success
    color white
</style>