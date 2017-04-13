<template lang="pug">

  router-link.pure-button.pure-button-primary(:to="url") {{ title }}

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'markdown-link',
  props: ['mdContent'],
  computed: {
    title() {
      return `View content for ${this.mdContent.title}`;
    },
    url() {
      return `/markdown/?url=${this.mdContent.url}`;
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
