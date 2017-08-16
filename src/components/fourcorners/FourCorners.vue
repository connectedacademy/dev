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

<style lang="stylus">

.four-corners-wrapper
  max-width 100% !important
  overflow hidden

.four-corners-wrapper > img, .four-corners-wrapper .fc-image, .four-corners-wrapper .fc-image > img
  max-width 100% !important
  width 100%

</style>
