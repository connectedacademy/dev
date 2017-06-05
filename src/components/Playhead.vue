<template lang="pug">

.playhead-bobble(@click="toggleVideoState")
  icon(name="twitter" scale="2" class="playhead-icon")
  //- icon(name="pause" scale="2" class="playhead-icon" v-if="videoPlaying")
  //- icon(name="pause" scale="2" class="playhead-icon" v-if="videoPlaying")

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'playhead',
  created() {},
  computed: {
    ...mapGetters([
      'videoPlaying',
    ]),
  },
  methods: {
    toggleVideoState() {
      if (this.videoPlaying) {
        this.$store.commit(types.PAUSE_VIDEO);
      } else {
        this.$store.commit(types.PLAY_VIDEO);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.playhead-bobble
  radius(50%)
  background-color $color-primary
  color white
  height 60px
  width 60px
  position absolute
  top -30px
  right -30px
  text-align center
  z-index 53
  animate()
  @media(max-width: 860px)
    margin-right 0
    right 10px
  &:hover
    cursor pointer
    background-color darken($color-primary, 10%)
  .playhead-icon
    height 30px
    margin 15px


</style>
