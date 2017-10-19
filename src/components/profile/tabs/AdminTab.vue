<template lang="pug">
#admin-tab.profile-tab

  //- Class Selector
  profile-class-selector(v-bind:show-all="true" v-bind:classes.sync="classes")

  //- Action Selector
  action-selector(userType="admin")

</template>

<script>
import { mapGetters } from 'vuex';

import ProfileClassSelector from '@/components/profile/ProfileClassSelector';
import ActionSelector from '@/components/profile/ActionSelector';

export default {
  name: 'admin-tab',
  components: {
    ProfileClassSelector,
    ActionSelector
  },
  data() {
    return {
      classes: [],
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
}
</script>

<style lang="stylus" scoped>
  
@import '~stylus/profile'

.profile-tab
  padding 20px
  &#admin-tab
    padding 20px

</style>
