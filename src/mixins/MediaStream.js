const SYNC_THRESHOLD = 2.0;

import { mapGetters } from 'vuex';
import { EventBus } from '@/event-bus.js';

import _throttle from 'lodash/throttle';
import _find from 'lodash/find';

require('howler');

export default {
  mounted() {
    let src = []
    for (const index in this.content.audio) {
      src.push(`https://${this.course.slug}.connectedacademy.io/course/content/audio/${this.content.audio[index]}`,)
    }
    
    this.sound = new Howl({
      src: src,
      // format: [
      //   'mp3',
      //   'ogg'
      //   // 'webm'
      // ],
      preload: true,
      html5: true,
      buffer: true
    });

    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus;
    });
    this.sound.on('seek', () => {
     this.checkBufferStatus();
    });
  },
  watch: {
    scrollStatus(nV) {
      this.performSync(this);
    },
    mediaPlaying(nV, oV) {
      if (nV) {
        this.sound.play();
      } else {
        this.sound.pause();
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
      sound: undefined,
      scrollStatus: undefined,
      mediaBuffering: false,
      bufferInterval: false,
    }
  },
  computed: {
    ...mapGetters([
      'course', 'mediaPlaying'
    ]),
  },
  methods: {
    checkBufferStatus() {

      if (!self.scrollStatus) return;

      let bufferingCount = 0;

      for (var index = 0; index < this.sound._sounds[0]._node.buffered.length; index++) {

        const start = this.sound._sounds[0]._node.buffered.start(index);
        const end = this.sound._sounds[0]._node.buffered.end(index);

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

      const playerTime = this.sound.seek();
      const outOfSync = ((self.scrollStatus.currentTime < (playerTime - SYNC_THRESHOLD)) || (self.scrollStatus.currentTime > (playerTime + SYNC_THRESHOLD)));

      if (outOfSync) {
        self.$log.info('OUTOFSYNC');
        this.sound.seek(self.scrollStatus.currentTime);
      }
    }, 500)
  }
}
