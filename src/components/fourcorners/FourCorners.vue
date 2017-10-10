<template lang="pug">

.four-corners-wrapper(v-html="html")

</template>

<script>
const FourCornersLib = require('fourcorners');

export default {
  name: 'four-corners',
  props: ['html'],
  activated() {
    this.initFourCorners()
  },
  mounted() {
    this.initFourCorners()
  },
  watch: {
    'html': {
      handler: function(nV, oV) {
        this.initFourCorners()
      },
      deep: true,
    },
  },
  methods: {
    initFourCorners() {
      this.$nextTick(() => {
        FourCornersLib.init();
      });
    }
  }
};
</script>

<style lang="stylus">

.four-corners-wrapper > img
    display block !important
    margin 0 !important
    max-width 100% !important
    padding 0 !important
    width 100% !important

</style>
