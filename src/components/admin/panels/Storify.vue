<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Storify

    .reload-button(@click="loadLink")
      icon(name="refresh")

  .admin-panel--content

    h5 Please copy and paste the following link into the Storify editor.
    input(v-model="rssLink" placeholder="RSS Link")
    
    img.storify-gif(src="../../../assets/gifs/storify.gif" width="100%")

</template>

<script>
import { mapGetters } from 'vuex';
import API from '@/api';
import find from 'lodash/find';

import 'vue-awesome/icons/refresh';

export default {
  name: 'storify',
  props: ['classSlug'],
  activated() {
    this.loadLink();
  },
  methods: {
    loadLink() {
      this.classroomCode = 'loading';

      const request = { theClass: this.classSlug, slug: 'liveclass' };

      API.classroom.getTeacherCode(
        request,
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
  data() {
    return {
      rssLink: undefined
    }
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/admin'

.admin-panel
  .admin-panel--content
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
      margin 30px auto
</style>
