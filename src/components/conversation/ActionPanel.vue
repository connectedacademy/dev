<template lang="pug">

  #action-panel(v-bind:class="{ hide: (!this.currentSection), 'hide-media': mediaHidden }")
    ul#experience-controls
    
      li.experience-control(@click="toggleVideoPlaying")
        icon(name="pause" v-if="videoPlaying")
        icon(name="play" v-else)
      li.experience-control
        icon(name="step-forward")
      li.experience-control#progress-bar
        #progress-bar--start {{ start }}
        #progress-bar--end {{ end }}
        #progress-bar--track
        #progress-bar--thumb(v-bind:style="{ left: `${((100 / content.duration) * currentTime)}%` }")

      li.experience-control.pull-right(@click="toggleComposer")
        icon(v-bind:name="mediaHidden ? 'chevron-up' : 'chevron-down'")
      li.experience-control#twitter-control.pull-right
        a(v-bind:href="twitterLink" target="_blank")
          icon(name="twitter")
      //- li.experience-control.pull-right(@click="togglePlayerType" v-bind:class="{ unclickable: (availablePlayerTypes <= 1) }")
        icon(v-bind:name="availablePlayerTypes[playerTypeIndex]")

      .clearfix
    media-container(v-bind:player-type="availablePlayerTypes[playerTypeIndex]" v-bind:class-section="content" v-bind:video-is-active="videoIsActive")

</template>

<script>
  import * as types from '@/store/mutation-types';
  import {
    mapGetters
  } from 'vuex';
  import Moment from 'moment-mini';
  
  import MessageComposer from '@/components/MessageComposer';
  import MediaContainer from '@/components/MediaContainer';
  
  import 'vue-awesome/icons/pause';
  import 'vue-awesome/icons/play';
  import 'vue-awesome/icons/step-forward';
  import 'vue-awesome/icons/twitter';
  import 'vue-awesome/icons/chevron-up';
  import 'vue-awesome/icons/chevron-down';
  import 'vue-awesome/icons/soundcloud';
  import 'vue-awesome/icons/youtube';
  
  export default {
    name: 'action-panel',
    props: ['content'],
    components: {
      MessageComposer,
      MediaContainer,
    },
    mounted() {
      this.availablePlayerTypes = []; // Remove all available player types
      if (this.content.videoId) {
        // If a videoId is set on the content then add YouTube as an available type
        this.availablePlayerTypes.push('youtube');
      }
      if (this.content.soundcloudId) {
        // If a soundcloudId is set on the content then add SoundCloud as an available type
        this.availablePlayerTypes.push('soundcloud');
      }
    },
    data() {
      return {
        playerTypeIndex: 0,
        availablePlayerTypes: [],
      };
    },
    computed: {
      ...mapGetters(['mediaHidden', 'videoPlaying', 'currentSection', 'currentTime', 'videoIsActive']),
      start() {
        return Moment().hour(0).minute(0).second(this.currentTime).format('mm:ss');
      },
      end() {
        return Moment().hour(0).minute(0).second(this.content.duration).format('mm:ss');
      },
      twitterLink() {
        return 'https://twitter.com';
        // return `https://twitter.com/${hashtag}`;
      },
    },
    methods: {
      toggleComposer() {
        this.$store.commit(this.mediaHidden ? 'SHOW_MEDIA' : 'HIDE_MEDIA');
      },
      toggleVideoPlaying() {
        this.$store.commit(this.videoPlaying ? 'PAUSE_VIDEO' : 'PLAY_VIDEO');
      },
      togglePlayerType() {
        this.playerTypeIndex = (this.playerTypeIndex === (this.availablePlayerTypes.length - 1)) ? 0 : (this.playerTypeIndex + 1);
      },
    }
  };
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

$media-height = 220px

#action-panel
  animate()
  background white
  border-top $color-border 1px solid
  bottom 0
  height ($media-height + 50px)
  z-index 50
  position fixed
  left 50%
  margin-left -390px
  width 780px
  &.hide-media
    bottom -($media-height)
  &.hide
    bottom -($media-height + 100px)

  @media(max-width: 800px)
    margin-left 0
    left 0
    width 100%

  ul#experience-controls
    cleanlist()
    box-sizing()
    height 50px
    padding 0 10px 0 10px
    position relative
    z-index 1

    li.experience-control
      cleanlist()
      animate()
      float left
      @media(max-width: 568px)        
        &#twitter-control
          display none
      &.pull-right
        float right
        border none
      .fa-icon
        animate()
        color $color-text-dark-grey
        display block
        height 18px
        width 18px
        margin 16px 10px
      &:hover
        // background-color $color-lighter-grey
        cursor pointer
        &.unclickable
          cursor default

    li#progress-bar
      pinned()
      margin 0
      position absolute
      left (38px * 2) + 20px + 40px
      right (38px * 1) + 20px + 40px + 40px
      @media(max-width: 568px)
        right (38px * 0) + 10px + 40px
        #progress-bar--end
          display none
      #progress-bar--start, #progress-bar--end
        font-size 0.8em
        font-weight bold
        line-height 50px
        padding 0 15px
        position absolute
        &#progress-bar--start
          color $color-primary
          left -60px
        &#progress-bar--end
          color $color-text-grey
          right -60px
      #progress-bar--track
        background-color $color-primary
        height 2px
        margin 24px 0
      #progress-bar--thumb
        radius(50%)
        background-color $color-primary
        height 10px
        width 10px
        margin-left -5px
        position absolute
        top 20px
        left 0px
      &:hover
        cursor default
      //   #progress-bar--thumb
      //     transform scale(2)
</style>
