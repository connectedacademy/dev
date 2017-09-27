<template lang="pug">

  .card#profile-card(v-if="user" v-bind:class="{ visible: visible }")
    form.pure-form.pure-form-stacked(v-if="editorVisible")
      fieldset(v-if="user.registration")
        label
          strong {{ $t('common.age') }}
        label {{ `${user.registration.age}` }}
      fieldset(v-if="user.registration")
        label
          strong {{ $t('common.current_language') }}
        label {{ `${user.registration.lang}` }}
      fieldset
        label
          strong {{ $t('common.current_service') }}
        label {{ `${user.service}` }}
      fieldset(v-if="user.registration")
        label
          strong {{ $t('common.current_hub') }}
        label {{ `${user.registration.hub_id}` }}

    a.pure-button.pure-button-action(v-if="user" @click="toggleProfileEditor") {{ editorVisible ? 'Hide Profile' : 'Show Profile' }}

</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'profile-card',
  props: ['visible'],
  data() {
    return {
      editorVisible: false,
    };
  },
  computed: {
    ...mapGetters(['user']),
    isAdmin() {
      // TODO: Check if admin
      return true;
    },
    user() {
      return this.user;
    },
  },
  methods: {
    toggleProfileEditor() {
      this.editorVisible = !this.editorVisible;
    },
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'
@import '~stylus/drawer'
@import '~stylus/forms'

.card#profile-card
  padding 15px
  .pure-button-action
    margin 0
  fieldset
    padding 5px
    label
      color white
      margin-bottom 5px
    select
      width 100%

</style>
