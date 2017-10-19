<template lang="pug">

.profile-panel

  profile-panel-header(label="Messages" v-on:refresh="loadData")

  .profile-panel--content.no-padding
    //- pre {{ messages }}
    message(v-for="(message, index) in messages" v-bind:key="index" v-bind:message="message" v-bind:truncate="false")

</template>

<script>
import { mapGetters } from 'vuex';
import API from '@/api';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';
import StudentTile from '@/components/profile/tiles/StudentTile';

import Message from '@/components/conversation/Message';

export default {
  name: 'messages',
  props: ['role'],
  components: {
    ProfilePanelHeader,
    StudentTile,
    Message,
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      messages: [],
    };
  },
  computed: {
    ...mapGetters(['profileClass', 'profileClassSlug']),
  },
  methods: {
    loadData() {
      this.messages = [];

      let request = {
        theClass: undefined,
        userId: undefined,
      }
      if (this.role === 'user') {
        request.userId = this.user.id;
      }

      API.admin.getMessages(
        request,
        (response) => {
          this.messages = response.data;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve messages');
          this.messages = [];
        },
      );
    },
  },
};

</script>
