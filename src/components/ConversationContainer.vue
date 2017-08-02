<template lang="pug">

  .conversation-container(ref="conversationContainer")

    #view-toggle(@click="messagePriority = !messagePriority" v-bind:class="{ 'message-priority': messagePriority}")
      icon(name="quote-right")
      icon(name="twitter")

    #activity-visualisation(v-if="!peekSegment")
      svg(width="400" v-bind:height="containerHeight")
        g
          path(v-bind:d="visualisationPoints" transform="translate(400,0)")

    .inner-wrapper(v-bind:style="{ height: containerHeight }" v-bind:class="{ 'message-priority': messagePriority }")
      time-segment(v-for="(message, index) in messages" v-bind:key="index" v-bind:index="index" v-bind:message="messages[index]" v-bind:subtitle="subtitles[(index / 0.2)]")

</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import API from '@/api';

// Mixins
import Messages from '@/mixins/Messages';
import Media from '@/mixins/Media';
import Subtitles from '@/mixins/Subtitles';
import Visualisation from '@/mixins/Visualisation';

import TimeSegment from '@/components/conversation/TimeSegment';

export default {
  name: 'conversation-container',
  mixins: [
    Messages,
    Media,
    Subtitles,
    Visualisation,
  ],
  components: {
    TimeSegment,
  },
  props: ['content'],
  data() {
    return {
      media: [],
      messagePriority: true,
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection', 'currentSegmentGroup', 'currentSegment', 'visualisation', 'lastMessage', 'peekSegment',
    ]),
    containerHeight() {
      return `${(this.content.duration * 0.2) * 158.0 + 124}px`;
    },
  },
  watch: {
    'lastMessage': {
      handler: function(nV, oV) {
        setTimeout(() => { this.loadSegmentSummary(this.currentSegmentGroup) }, 600);
      },
      deep: true,
    },
    currentSegmentGroup(nV, oV) {
      if (nV === undefined) { return; }
      if (oV !== nV) {
        this.$log.log(`Getting messages for segment ${nV}`);

        this.loadSegmentSummary(nV);
      }
    },
    visualisation(nV, oV) {
      this.loadVisualisation(this.visualisation);
    },
    currentSection(nV, oV) {
      if (nV === undefined) { return; }
      if (oV !== nV) {
        var self = this;

        const request = {
          theClass: this.$store.getters.currentClass.slug,
          theContent: this.currentSection.slug,
        };

        // TODO: Remove hardcoded value
        const images = 'transcripts/SI0kWdWG0JY_images.json';

        this.$store.dispatch('getMedia', { slug: `${this.currentSection.slug}`, path: `${this.$store.getters.course.baseUri}${this.$store.getters.currentClass.dir}/${images}` });

        this.$store.dispatch('getVisualisation', request);

        this.loadSubtitles();
      }
    },
  },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.conversation-container
  background-color white
  position relative

  &.collapsed
    max-height 600px
    overflow hidden

  h5
    reset()
    color #444
    height 60px
    line-height 60px
    width 100%

  #activity-visualisation
    pointer-events none
    position absolute
    right 0
    top 0
    z-index 0

    svg
      overflow visible
      path
        fill alpha($color-primary, 1)

    @media(max-width: 600px)
      z-index 50
      left -400px
      right auto
      svg
        path
          fill alpha($color-primary, 0.3)


  .inner-wrapper
    overflow hidden
    .subtitle-wrapper, .message-wrapper
      animate()
      width 50%
      &.subtitle-wrapper
        transform translate(0%, -50%)
      &.message-wrapper
        transform translate(100%, -50%)

    @media(max-width: 600px)
      .subtitle-wrapper, .message-wrapper
        width 100%
        &.subtitle-wrapper
          transform translate(0%, -50%)
        &.message-wrapper
          transform translate(100%, -50%)
      &.message-priority
        .subtitle-wrapper, .message-wrapper
          width 100%
          &.subtitle-wrapper
            transform translate(-100%, -50%)            
          &.message-wrapper
            transform translate(0%, -50%)

#view-toggle
  animate()
  radius(50%)
  background-color $color-primary
  color white
  display none
  height 80px
  width 80px
  position fixed
  z-index 57
  top 50%
  left calc(100% - 40px)
  transform translate(0%, -50%)
  text-align left
  @media(max-width: 600px)
    display block
  .fa-icon
    animate()
    float left
    height 80px
    padding 0 10px
    width 20px

  &.message-priority
    left -40px
    transform translate(0%, -50%)

</style>
