<template lang="pug">

  .col#col-main.background-white(v-bind:class="this.$store.state.layout.columns.main.state")
    .container
      h1 Schedule

      hub-selector

      .pure-button.pure-button-primary(v-if="this.$store.state.debug" @click="previewVisible =! previewVisible") Toggle Preview

      .debug-wrapper(v-if="this.$store.state.debug && previewVisible")
        .content-block.white-block
          pre(v-if="hubs") {{ hubs }}

</template>

<script>
import {mapGetters} from 'vuex';

import HubSelector from '../HubSelector';

export default {
  name: 'schedule',
  data() {
    return {
      navTitle: 'Schedule - Connected Academy',
      previewVisible: false,
    };
  },
  computed: {
    ...mapGetters([
      'course', 'hubs',
    ]),
  },
  components: {
    HubSelector,
  },
};
</script>

<style lang="stylus" scoped>

@import '../../assets/stylus/shared';
@import '../../assets/stylus/layout/page';

</style>
