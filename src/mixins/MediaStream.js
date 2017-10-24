const SYNC_THRESHOLD = 2.0;

import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';

import _throttle from 'lodash/throttle';
import _find from 'lodash/find';

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
    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus;
    });
    sound.on('seek', () => {
     this.checkBufferStatus();
    });
  },
  watch: {
    scrollStatus(nV) {
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
      scrollStatus: undefined,
      mediaBuffering: false,
      bufferInterval: false,
    }
  },
  computed: {
    ...mapGetters([
      'mediaPlaying'
    ]),
  },
  methods: {
    checkBufferStatus() {

      if (!self.scrollStatus) return;

      let bufferingCount = 0;

      for (var index = 0; index < sound._sounds[0]._node.buffered.length; index++) {

        const start = sound._sounds[0]._node.buffered.start(index);
        const end = sound._sounds[0]._node.buffered.end(index);

        const inBufferedZone = ((this.scrollStatus.currentTime > start) && (this.scrollStatus.currentTime < end));

        if (inBufferedZone) {
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
    performSync: _throttle(function (self) {

      const playerTime = sound.seek();
      const outOfSync = ((self.scrollStatus.currentTime < (playerTime - SYNC_THRESHOLD)) || (self.scrollStatus.currentTime > (playerTime + SYNC_THRESHOLD)));

      if (outOfSync) {
        self.$log.info('OUTOFSYNC');
        sound.seek(self.scrollStatus.currentTime);
      }
    }, 500),
  },
}
