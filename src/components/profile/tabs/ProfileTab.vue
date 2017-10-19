<template lang="pug">
#profile-tab.profile-tab
  h1 Hi {{ user.name }}

  img.user-profile(v-bind:src="user.profile")
  
  h3 Your Roles
  tag-list(v-bind:tags="userRoles")

  h3 Your Linked Accounts
  tag-list(v-bind:tags="[{ label: user.account, link: user.link }]" linked)

  //- Action Selector
  action-selector(userType="user")

</template>

<script>
import { mapGetters } from 'vuex';

import ActionSelector from '@/components/profile/ActionSelector';
import TagList from '@/components/shared/TagList'

export default {
  name: 'profile-tab',
  components: {
    ActionSelector,
    TagList,
  },
  computed: {
    ...mapGetters(['user']),
    userRoles() {
      return this.user.roles;
    }
  },
}
</script>

<style lang="stylus" scoped>
  
@import '~stylus/profile'

.profile-tab
  padding 20px
  &#profile-tab
    padding 20px
    img.user-profile
      radius(50%)
      height 60px

</style>