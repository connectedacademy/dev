<template lang="pug">

  router-link.pure-button.pure-button-primary(:to="url") {{ $t('common.read_more') }}

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'markdown-link',
  props: ['mdContent'],
  computed: {
    url() {
      return `/markdown/?url=${this.mdContent.url}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
