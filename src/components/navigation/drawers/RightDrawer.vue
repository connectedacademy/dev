<template lang="pug">

  transition(name="slide-right")
    .drawer#drawer-right(v-if="isVisible")

      user-card(v-bind:visible="isVisible")
      //- profile-card(v-bind:visible="isVisible")
      classroom-card(v-bind:visible="isVisible")

</template>

<script>
import ClassroomCard from '@/components/cards/ClassroomCard';
import ProfileCard from '@/components/cards/ProfileCard';
import UserCard from '@/components/cards/UserCard';

export default {
  name: 'right-drawer',
  components: {
    ClassroomCard,
    ProfileCard,
    UserCard,
  },
  mounted() {
    this.$store.dispatch('checkAuth');
  },
  methods: {
    toggleRightDrawer() {
      this.$store.commit('TOGGLE_RIGHT_DRAWER');
    },
  },
  computed: {
    isVisible() {
      return this.$store.state.navigation.rightDrawer.visible;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

</style>
