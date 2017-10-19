<template lang="pug">

.profile-panel

  profile-panel-header(label="Storify" v-on:refresh="loadLink")

  .profile-panel--content

    h5 Storify allows you to create a narrative around the conversations and content of your live class.
    h5 The following link will make your class content accessible from the Storify editor.
    input(v-model="rssLink" placeholder="RSS Link")

    br
    br
    h5 How to paste the link into Storify:
    img.storify-gif(src="../../../assets/gifs/storify.gif" width="100%")

    br
    br

    a.pure-button.pure-button-primary(href="https://storify.com/" target="_blank") Open Storify

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';

export default {
  name: 'storify',
  props: ['classSlug'],
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
      this.classroomCode = 'loading';

      API.classroom.getTeacherCode(
        this.profileClassSlug,
        (response) => {
          this.$log.info(response);
          this.rssLink = `https://api.connectedacademy.io/v1/classroom/rss/${response.code}`;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve teacher code');
        },
      );
    }
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

.profile-panel
  .profile-panel--content
    h5
      reset()
      margin-bottom 15px
    input
      radius(4px)
      border $color-border 1px solid
      box-sizing()
      padding 10px
      width 100%
    img.storify-gif
      border $color-border 1px solid
      margin-bottom 30px auto
</style>
