<template lang="pug">

  transition(name="slide-right")
    .drawer#drawer-right(v-if="isVisible")

      user-card(:visible="isVisible")
      classroom-card(:visible="isVisible")
      //- profile-card(:visible="isVisible")

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
