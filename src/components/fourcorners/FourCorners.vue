<template lang="pug">

.four-corners-wrapper(v-html="html")

</template>

<script>
const FourCornersLib = require('fourcorners');

export default {
  name: 'four-corners',
  props: ['html'],
  watch: {
    'html': {
      handler: function(nV, oV) {

        setTimeout(() => {
          FourCornersLib.init();
        }, 1000);
      },
      deep: true,
    },
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
