<template lang="pug">

  .card#admin-card(v-if="isAdmin" v-bind:class="{ visible: visible }")
    router-link.pure-button.pure-button-action(to="/admin")
      | Admin Tools

</template>

<script>
import _ from 'lodash';

export default {
  name: 'admin-card',
  props: ['visible'],
  computed: {
    isAdmin() {
      // TODO: Check if admin
      return true;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/drawer'

.card#admin-card
  background-color #333
  padding 15px
  .pure-button.pure-button-action
    margin 0

</style>
