<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight }")

  profile-panel-header(v-bind:label="`${panel.label} (${messages.length})`" v-on:refresh="loadData" v-on:expand="expand" can-refresh v-bind:can-expand="canExpand")
  .profile-panel--content.no-padding
    .no-results(v-if="messages.length === 0")
      | No Results
    message(v-for="(message, index) in messages" v-bind:key="index" v-bind:message="message" v-bind:truncate="false" v-if="(limitHeight && (index < 4)) || !limitHeight")

</template>

<script>
import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';
import API from '@/api';

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader';
import StudentTile from '@/components/profile/tiles/StudentTile';

import Message from '@/components/conversation/Message';

export default {
  name: 'messages',
  props: ['panel', 'limitHeight', 'canExpand', 'expandedView'],
  components: {
    ProfilePanelHeader,
    StudentTile,
    Message,
  },
  mounted() {
    if (this.expandedView) { this.loadData(); }
    this.autoUpdateInterval = setInterval(() => { this.loadData() }, 20000);
    EventBus.$on('profileClassUpdated', () => {
      this.loadData();
    });
  },
  beforeDestroy() {
    clearInterval(this.autoUpdateInterval);
  },
  data() {
    return {
      messages: [],
      autoUpdateInterval: undefined,
    };
  },
  computed: {
    ...mapGetters(['user', 'profileClassSlug']),
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel);
    },
    loadData() {
      let request = {
        theClass: (typeof this.profileClassSlug !== 'undefined') ? this.profileClassSlug : undefined,
        userId: (this.panel.role === 'user') ? this.user.id : undefined,
        teacher: (this.panel.role === 'teacher') ? true : undefined,
      }

      API.profile.getMessages(
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

<style lang="stylus" scoped>

@import '~stylus/profile'
  
</style>