<template lang="pug">

.profile-panel

  profile-panel-header(label="Storify")

  .profile-panel--content

    h5 Storify allows you to create a narrative around the conversations and content of your live class.

    img.storify-gif(src="../../../assets/gifs/storify.gif" width="100%")

    h5 The following link will make your class content accessible from the Storify editor.
    input(v-model="storifyLink" placeholder="RSS Link")

    a#storify-button(href="https://storify.com/" target="_blank") Open Storify

</template>

<script>
import { mapGetters } from 'vuex';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';

import _filter from 'lodash/filter';
import _find from 'lodash/find';

export default {
  name: 'storify',
  props: ['classSlug', 'expandedView', 'classes'],
  components: {
    ProfilePanelHeader,
  },
  data() {
    return {
      rssLink: undefined
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClass', 'profileClassSlug']),
    classrooms() {
      const currentClass = _find(this.classes, { slug: this.profileClassSlug });
      let classrooms = (currentClass) ? currentClass.codes : [];

      // Just for current user
      const teachersOnly = true;
      if (teachersOnly) {
        classrooms = _filter(classrooms, (classroom) => {
          return classroom.teacher && (classroom.teacher.account === this.user.account);
        });
      }
      return classrooms;
    },
    storifyLink() {
      return (this.classrooms.length > 0) ? `https://api.connectedacademy.io/v1/classroom/rss/${this.classrooms[0].code}` : 'undefined';
    }
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

.profile-panel
  .profile-panel--content
    padding 15px
    h5
      reset()
    input
      radius(4px)
      box-sizing()
      background-color $color-lightest-grey
      border none
      padding 20px
      margin 10px auto 30px auto
      outline 0
      width 100%
    img.storify-gif
      border $color-border 1px solid
      margin 10px auto 30px auto

    a#storify-button
      background-color $color-storify
      color white
      display block
      line-height 50px
      text-align center
      text-decoration none
</style>
