<template lang="pug">

  router-link.pure-button(:to="url") {{ $t('common.explore_content') }}

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
      return `/markdown/${encodedURI}`;
    },
  },
};
</script>
