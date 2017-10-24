<template lang="pug">

.profile-panel

  profile-panel-header(label="Storify" can-refresh)

  .profile-panel--content

    h5 Storify allows you to create a narrative around the conversations and content of your live class.

    img.storify-gif(src="../../../assets/gifs/storify.gif" width="100%")

    h5 The following link will make your class content accessible from the Storify editor.
    input(v-model="rssLink" placeholder="RSS Link")

    a#storify-button(href="https://storify.com/" target="_blank") Open Storify

</template>

<script>
import { mapGetters } from 'vuex';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';

export default {
  name: 'storify',
  props: ['classSlug', 'expandedView'],
  components: {
    ProfilePanelHeader,
  },
  mounted() {
    this.loadLink();
  },
  data() {
    return {
      rssLink: undefined
    }
  },
  computed: {
    ...mapGetters(['profileClass', 'profileClassSlug']),
  },
  methods: {
    loadLink() {
      const classroomCode = 'undefined';
      this.rssLink = `https://api.connectedacademy.io/v1/classroom/rss/${classroomCode}`;
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
