<template lang="pug">

    .schedule-page

      .col#col-main

        //- hub-selector

        .main-container.main-container-padded.background-white
          h3 Course Schedule
          ul
            li(v-for="(theClass, index) in course.classes")
              h3 {{ theClass.title }}
              h5 {{ theClass.description }}
              p {{ (theClass.status === 'RELEASED') ? 'Released' : 'Will be released' }} on {{ releaseAt(theClass.release_at) }}
              //- pre {{ theClass }}

</template>

<script>
import * as types from '@/store/mutation-types';
import {mapGetters} from 'vuex';
import Moment from 'moment';
import HubSelector from '../HubSelector';

export default {
  name: 'schedule',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(types.SET_NAV_STATE, { minimized: false });
      vm.$store.commit(types.SET_PAGE_STYLE, undefined);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit(types.SET_NAV_STATE, { minimized: true });
    this.$store.commit(types.SET_PAGE_STYLE, undefined);
    next();
  },
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
  methods: {
    releaseAt(date) {
      return Moment(date).format('ddd d MMMM YYYY hh:MM:SS')
    }
  }
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.schedule-page
  .main-container-padded
    padding 30px
    h1
      reset()
      margin-bottom 20px
    ul
      cleanlist()
      li
        cleanlist()
        radius(6px)
        border $color-border 1px solid
        margin-bottom 20px
        padding 20px
        &:last-child
          margin-bottom 0px
        h3
          reset()
          font-size 1.3em
        h5
          reset()
          color $color-text-grey
          font-weight normal
          font-size 1.1em
        p
          reset()
          font-size 1em
</style>
