const SYNC_THRESHOLD = 1.0;

import { mapGetters } from 'vuex';

import throttle from 'lodash/throttle';

require('howler');

var sound = new Howl({
  // src: ['https://interpretation.connectedacademy.io/course/content/audio/CA_TL_1_v4_56.mp3'],
  // format: ['mp3'],
  src: [
    // 'https://interpretation.connectedacademy.io/course/content/audio/CA_TL_1_v4_32.webm',
    'https://interpretation.connectedacademy.io/course/content/audio/CA_TL_1_v4_32.mp3',
    'https://interpretation.connectedacademy.io/course/content/audio/CA_TL_1_v4_32.ogg'
  ],
  format: [
    // 'webm',
    'mp3',
    'ogg'
  ],
  preload: true,
  html5: true,
  buffer: true
});

export default {
  mounted() {
    sound.on('seek', () => {

     this.checkBufferStatus();
    });
  },
  watch: {
    pendingScrollPosition(nV) {
      if (nV === 0) return;

      const scrollPoint = this.$store.state.scrollPoints[this.content.slug];
      this.$store.commit('setPendingScrollPosition', 0);

      window.scroll(0, scrollPoint.top + ((nV * 0.2) * this.$app.segmentHeight));

      sound.seek(nV);
     
    },
    currentTime(nV) {

      this.performSync(this);
    },
    mediaPlaying(nV, oV) {
      if (nV) {
        sound.play();
      } else {
        sound.pause();
      }
    },
    videoIsActive(nV) {
      if (!nV) {
        this.$store.commit('PAUSE_MEDIA');
      }
    },
    activeSegment(nV) {
      if (nV) {
        this.$store.commit('PAUSE_MEDIA');
      }
    },
    peekSegment(nV) {
      if (nV) {
        this.$store.commit('PAUSE_MEDIA');
      }
    },
  },
  data() {
    return {
      mediaBuffering: false,
      bufferInterval: false,
    }
  },
  computed: {
    ...mapGetters([
      'currentTime', 'mediaPlaying', 'pendingScrollPosition'
    ]),
  },
  methods: {
    checkBufferStatus() {

      let bufferingCount = 0;

      for (var index = 0; index < sound._sounds[0]._node.buffered.length; index++) {

        const start = sound._sounds[0]._node.buffered.start(index);
        const end = sound._sounds[0]._node.buffered.end(index);

        const inBufferedZone = ((this.currentTime > start) && (this.currentTime < end));

        if (inBufferedZone) {
          this.$log.info('all good');
          this.bufferInterval = false;
          this.mediaBuffering = false;
          return;
        }
      }

      if (this.mediaBuffering) {
        this.$log.info('BUFFERING');
        this.mediaBuffering = true;
        setTimeout(() => {
          this.checkBufferStatus();
        }, 500);
      }
      
    },
    performSync: throttle(function (self) {

      const playerTime = sound.seek();
      const outOfSync = ((self.currentTime < (playerTime - SYNC_THRESHOLD)) || (self.currentTime > (playerTime + SYNC_THRESHOLD)));

      self.$log.info(playerTime);
      self.$log.info(self.currentTime);

      if (outOfSync) {
        self.$log.info('OUTOFSYNC');
        sound.seek(self.currentTime);
      }
    }, 500),
  },
}
