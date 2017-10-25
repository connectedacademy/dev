<template lang="pug">

.profile-panel.no-header

  .profile-panel--content
    img#user-avatar(v-bind:src="user.profile" height="50px")

    h3 Hi {{ user.name }}
    
    //- Roles
    tag-list(v-bind:tags="userRoles")

    //-h3 Your Linked Accounts
    //-tag-list(v-bind:tags="[{ label: user.account, link: user.link }]" linked)

    h3 Classroom Codes
    .pure-button.pure-button-primary.full-width.no-margin#generate-code(v-if="classrooms.length === 0" @click.once="generateCode")
      | Generate Teacher Code
    .classroom-tile(v-else v-for="(classroom, index) in classrooms" v-bind:key="index")
      .code {{ classroom.code }}
      .teacher(v-if="classroom.teacher && classroom.teacher.name") {{ classroom.teacher.name }}
      //- pre {{ classroom }}

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';

import ActionSelector from '@/components/profile/ActionSelector';
import TagList from '@/components/shared/TagList'

import _find from 'lodash/find';
import _filter from 'lodash/filter';

import 'vue-awesome/icons/angle-right';

export default {
  name: 'user',
  props: ['label', 'classes'],
  components: {
    ActionSelector,
    TagList,
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug']),
    userRoles() {
      return this.user.roles;
    },
    proseLink() {
      return 'http://prose.io/#connectedacademy';
    },
    storifyLink() {
      return 'https://storify.com';
    },
    classrooms() {
      const currentClass = _find(this.classes, { slug: this.profileClassSlug });
      let classrooms = (currentClass) ? currentClass.codes : [];

      // Just for current user
      const teachersOnly = true;
      if (teachersOnly) {
        classrooms = _filter(classrooms, (classroom) => {
          return (classroom.teacher && (classroom.teacher.account === this.user.account) || (classroom.teacher === this.user.id));
        });
      }
      return classrooms;
    },
  },
  methods: {
    generateCode() {
      API.classroom.getTeacherCode(
        this.profileClassSlug,
        (response) => {
          this.$log.info(response);
          EventBus.$emit('updateClasses');
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve teacher code');
        },
      );
    },
  },
}
</script>

<style lang="stylus" scoped>
  
@import '~stylus/profile'

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

</style>