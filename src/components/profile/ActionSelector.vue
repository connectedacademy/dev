<template lang="pug">
.action-selector
  h3 Select action
  ul.action-selector
    li(v-for="(availableAction, index) in availableActions" v-bind:class="{ active: (profileAction && (profileAction.action === availableAction.action) )}")
      .action-title(@click="setAction(availableAction)") {{ availableAction.label }}
    .clearfix
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'action-selector',
  props: ['userType'],
  data() {
    return {
      allActions: {
        viewMessages: {
          label: 'View Messages',
          action: 'messages',
        },
        homeworkSubmissions: {
          label: 'Homework Submissions',
          action: 'submissions',
        },
        viewStudents: {
          label: 'View Students',
          action: 'students',
        },
        storifyExport: {
          label: 'Storify Export',
          action: 'storify',
        },
      },
    }
  },
  computed: {
    ...mapGetters(['profileAction']),
    availableActions() {
      let actions = [];
      // All users
      actions.push(this.allActions.viewMessages);
      actions.push(this.allActions.homeworkSubmissions);

      // Teachers and admins
      if (this.userType === 'teacher' || this.userType === 'admin') {
        actions.push(this.allActions.viewStudents);
        actions.push(this.allActions.storifyExport);
      }
      return actions;
    }
  },
  methods: {
    setAction(action) {
      action = (action === this.profileAction) ? undefined : action;
      this.$store.commit('updateProfileAction', action);
    },
  },
}
</script>

<style lang="stylus" scoped>
  
@import '~stylus/profile'
  
.action-selector
  ul
    cleanlist()
    margin -10px
    li
      cleanlist()
      background-color $color-darkest-grey
      float left
      margin 10px
      min-width 140px
      padding 0 20px
      text-align center
      .action-title
        color white
        line-height 80px
        overflow hidden
        whitespace nowrap
      &:hover
        background-color darken($color-darkest-grey, 10%)
        cursor pointer
      &.active
        background-color $color-primary

</style>