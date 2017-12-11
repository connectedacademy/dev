<template lang="pug">

  #action-panel(name="action-panel" v-bind:class="{ hide: (!this.currentSection), 'hide-media': mediaHidden }" ref="actionpanel")

    ul#experience-controls
    
      li.experience-control(name="play-pause-button" @click="toggleMediaPlayback")
        //- onboarding-prompt(identifier="play-pause-toggle" prompt="play/pause" top="-45" left="10" position="bottom-left" z-index="1")
        icon(v-bind:name="mediaPlaying ? 'pause' : 'play'")
      
      li.experience-control(@click="skipToEnd")
        icon(name="step-forward")
      
      li.experience-control
        p {{ mediaBuffering ? 'BUFF' : currentTime }}
      
      li.experience-control#progress-bar(ref="progressbar" @click="trackClicked" @mousedown="startScrub" @mouseup="endScrub" @mouseleave="endScrub" @mousecancel="endScrub" @mousemove="scrubMove")
        visualisation(v-bind:bufferedSegments="bufferedSegments" v-bind:content="content" v-bind:current-class="currentClass")
      
      li.experience-control.pull-right(@click="toggleComposer")
        onboarding-prompt(identifier="media-toggle" prompt="toggle media" top="-45" left="-132" position="bottom-right" z-index="1")
        icon(v-bind:name="mediaHidden ? 'chevron-up' : 'chevron-down'")

      //- li.experience-control.pull-right(@click="togglePlayerType" v-bind:class="{ unclickable: (availablePlayerTypes <= 1) }")
        icon(v-bind:name="availablePlayerTypes[playerTypeIndex]")

      .clearfix

    media-container(v-bind:player-type="playerType" v-bind:content="content" v-bind:current-class="currentClass")

</template>

<script>
  import { EventBus } from '@/event-bus.js';
  import { mapGetters } from 'vuex';
  import Moment from 'moment-mini';
  
  import MessageComposer from '@/components/MessageComposer';
  import MediaContainer from '@/components/MediaContainer';
  import Visualisation from '@/components/conversation/Visualisation';

  import _round from 'lodash/round';

  import MediaStream from '@/mixins/MediaStream';

  import 'vue-awesome/icons/pause';
  import 'vue-awesome/icons/play';
  import 'vue-awesome/icons/step-forward';
  import 'vue-awesome/icons/chevron-up';
  import 'vue-awesome/icons/chevron-down';
  import 'vue-awesome/icons/soundcloud';
  import 'vue-awesome/icons/youtube';
  import 'vue-awesome/icons/circle-o-notch';
  
  export default {
    name: 'action-panel',
    props: ['currentClass', 'content'],
    components: {
      MessageComposer,
      MediaContainer,
      Visualisation,
    },
    mixins: [
      MediaStream,
    ],
    mounted() {
      EventBus.$on('scrollStatus', (scrollStatus) => {
        if (scrollStatus.currentTime < 0) {
          this.currentTime = '0:00'
        } else {
          let time = _round(scrollStatus.currentTime);
          this.currentTime = `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`
        }
      })

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
        currentTime: 0,
        playerTypeIndex: 0,
        availablePlayerTypes: [],
        mouseOffsetStart: 0,
        trackOffset: 0,
      };
    },
    computed: {
      ...mapGetters(['mediaHidden', 'mediaPlaying', 'currentSection']),
      end() {
        return Moment().hour(0).minute(0).second(this.content.duration).format('mm:ss');
      },
      playerType() {
        return this.availablePlayerTypes[this.playerTypeIndex];
      },
    },
    methods: {
      scrubMove(event) {
        if (this.mouseOffsetStart !== 0) {
          this.trackOffset = (event.pageX - this.$refs.actionpanel.offsetLeft - this.$refs.progressbar.offsetLeft);
          
          const newPos = ((this.trackOffset / this.$refs.progressbar.offsetWidth) * this.content.duration);
          window.scroll(0, ((newPos * 0.2) * 158.0));
        }
      },
      startScrub(event) {
        this.$store.commit('EXPAND_CONVERSATION');
        this.$store.commit('PAUSE_MEDIA');
        this.trackOffset = 0;
        setTimeout(() => {
          this.mouseOffsetStart = event.pageX;
        }, 200);
      },
      endScrub(event) {
        
        this.mouseOffsetStart = 0;

        setTimeout(() => {
          this.trackOffset = 0;
        }, 500);
      },
      trackClicked(event) {
        // if (this.mouseOffsetStart !== 0) {
        //   this.trackOffset = (event.pageX - this.$refs.actionpanel.offsetLeft - this.$refs.progressbar.offsetLeft);
        // }
        // const newPos = ((this.trackOffset / this.$refs.progressbar.offsetWidth) * this.content.duration);
        // this.$log.debug(newPos);
        // window.scroll(0, (newPos + this.currentSection.top));

        // this.mouseOffsetStart = 0;

        // setTimeout(() => {
        //   this.trackOffset = 0;
        // }, 500);
      },
      toggleComposer() {
        this.$store.commit(this.mediaHidden ? 'SHOW_MEDIA' : 'HIDE_MEDIA');
      },
      toggleMediaPlayback() {
        this.$store.commit(this.mediaPlaying ? 'PAUSE_MEDIA' : 'PLAY_MEDIA');
        this.$store.commit(this.mediaPlaying ? 'SHOW_MEDIA' : 'HIDE_MEDIA');
      },
      togglePlayerType() {
        this.playerTypeIndex = (this.playerTypeIndex === (this.availablePlayerTypes.length - 1)) ? 0 : (this.playerTypeIndex + 1);
      },
      skipToEnd() {
        this.$store.commit('PAUSE_MEDIA');
        window.scroll(0, this.currentSection.bottom);
      }
    }
  };
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

$controls-height = 60px

#action-panel
  animate()
  pinned()
  background white
  border-top $color-border 1px solid
  top auto
  height ($media-height + $controls-height)
  z-index 50
  position fixed
  width 780px
  left 50%
  margin-left -390px
  &.full-width
    width 100%
    left 0
    margin-left 0
  &.hide-media
    bottom -($media-height)
  &.hide
    bottom -($media-height + 200px)

  @media(max-width: 800px)
    margin-left 0
    left 0
    width 100%

  ul#experience-controls
    cleanlist()
    box-sizing()
    height $controls-height
    padding 0 10px 0 10px
    position relative
    z-index 1
    max-width 780px
    margin 0 auto

    li.experience-control
      cleanlist()
      animate()
      float left
      position relative
      text-align center
      @media(max-width: 568px)        
        &#twitter-control
          display none
      &.pull-right
        float right
        border none
      p
        reset()
        font-size 0.8em
        font-weight bold
        line-height $controls-height
      .fa-icon
        animate()
        color $color-text-dark-grey
        display block
        height 18px
        width 18px
        margin (($controls-height - 18px) / 2) 10px
      &:hover
        // background-color $color-lighter-grey
        cursor pointer
        &.unclickable
          cursor default

    li#progress-bar
      pinned()
      margin 0
      position absolute
      left (38px * 3) + 20px
      right (38px * 1) + 20px

</style>
