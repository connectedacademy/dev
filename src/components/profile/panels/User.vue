<template lang="pug">

.profile-panel.no-header

  //- profile-panel-header(label="Select Class")
  profile-class-selector

  .profile-panel--content

    
    .pure-button.pure-button-info.full-width.no-margin#generate-code(v-if="classrooms.length === 0" @click.once="generateCode")
      | Generate Code
    .classroom-tile(v-else v-for="(classroom, index) in classrooms" v-bind:key="index")
      | {{ classroom.code }}
    
    h3 Roles
    tag-list(v-bind:tags="userRoles")

    .clearfix

    //- #admin-mode-button.pure-button.pure-button-subtle.pure-button-small(@click="toggleAdminView" v-bind:class="{ active: adminView }") Admin View
    
    .clearfix

    //- h3 Linked Accounts
    //- tag-list(v-bind:tags="[{ label: user.account, link: user.link }]" linked)

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'
import ActionSelector from '@/components/profile/ActionSelector'
import TagList from '@/components/shared/TagList'
import ProfileClassSelector from '@/components/profile/ProfileClassSelector'

import _find from 'lodash/find'
import _filter from 'lodash/filter'

export default {
  name: 'user',
  props: ['label', 'adminView'],
  components: {
    ProfilePanelHeader,
    ActionSelector,
    TagList,
    ProfileClassSelector
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
      return (this.user && this.user.profile.avatar) ? this.user.profile.avatar.replace('_normal', '') : ''
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
    text-align left

    .classroom-tile
      radius(6px)
      background $color-success
      border $color-success 1px solid
      color white
      font-weight bold
      line-height 1.5em
      padding 0.4em 1em
      text-align center

#admin-mode-button
  margin-top 10px
  &.active
    background-color $color-success
    border-color $color-success
    color white
</style>