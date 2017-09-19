<template lang="pug">

.four-corners-wrapper(v-html="html")

</template>

<script>
import FourCornersMixin from '@/mixins/FourCorners';

export default {
  name: 'four-corners',
  props: ['html'],
  mixins: [
    FourCornersMixin,
  ],
};
</script>

<style lang="stylus" scoped>

// img
//   width 100% !important

</style>
