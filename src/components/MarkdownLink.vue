<template lang="pug">

  .markdown-link
    router-link.pure-button(v-bind:name="`${mdContent.slug}-markdown-link`" v-if="isRegistered" v-bind:to="url")
      | {{ $t('common.explore_content') }}
      icon.angle-icon(name="angle-right")
    .pure-button(v-bind:name="`${mdContent.slug}-markdown-link`" v-else @click="showAuth()")
      | {{ $t('common.explore_content') }}
      icon.angle-icon(name="angle-right")

</template>

<script>
import { mapGetters } from 'vuex';

import 'vue-awesome/icons/angle-right';

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
  methods: {
    showAuth() {
      this.$store.commit('SHOW_AUTH');
    }
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
