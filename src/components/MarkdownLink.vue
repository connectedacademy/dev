<template lang="pug">

  router-link.pure-button(v-if="isRegistered" v-bind:to="url")
    | {{ $t('common.explore_content') }}
    icon.angle-icon(name="angle-right")

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'markdown-link',
  props: ['mdContent'],
  computed: {
    ...mapGetters([
      'isRegistered',
    ]),
    url() {
      const encodedURI = encodeURIComponent(`${this.$store.getters.currentClass.dir}/${this.mdContent.url}`);
      return `/markdown/${encodedURI}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.angle-icon
  top 3px
  position relative
  margin-left 7px

</style>
