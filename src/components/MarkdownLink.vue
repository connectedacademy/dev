<template lang="pug">

  router-link.pure-button.pure-button-primary(:to="url") {{ $t('common.explore_content') }}

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'markdown-link',
  props: ['mdContent'],
  computed: {
    url() {
      const encodedURI = encodeURIComponent(`${this.$store.getters.currentClass.dir}/${this.mdContent.url}`);
      console.log('encodedURI');
      console.log(encodedURI);
      return `/markdown/${encodedURI}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
