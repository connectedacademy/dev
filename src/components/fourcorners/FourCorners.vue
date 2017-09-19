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

.four-corners-wrapper > img
    display block !important
    margin 0 !important
    max-width 100% !important
    padding 0 !important
    width 100% !important


</style>
