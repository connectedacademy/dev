<template lang="pug">

  .drawer#drawer-right(v-bind:class="{ visible: state.visible }")

    user-card(v-bind:visible="state.visible")
    profile-card(v-bind:visible="state.visible")
    classroom-card(v-bind:visible="state.visible")
    admin-card.hidden(v-bind:visible="state.visible")

</template>

<script>
import * as types from '@/store/mutation-types';

import AdminCard from '@/components/cards/AdminCard';
import ClassroomCard from '@/components/cards/ClassroomCard';
import ProfileCard from '@/components/cards/ProfileCard';
import UserCard from '@/components/cards/UserCard';

export default {
  name: 'right-drawer',
  components: {
    AdminCard,
    ClassroomCard,
    ProfileCard,
    UserCard,
  },
  methods: {
    toggleRightDrawer() {
      this.$store.commit(types.TOGGLE_RIGHT_DRAWER);
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    state() {
      return this.$store.state.navigation.rightDrawer;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

</style>
