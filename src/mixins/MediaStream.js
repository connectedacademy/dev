import { mapGetters } from 'vuex';

import throttle from 'lodash/throttle';

require('howler');

var sound = new Howl({
  src: ['https://interpretation.connectedacademy.io/course/content/audio/CA_TL_1_v4_56.mp3'],
  preload: false,
  html5: true,
  buffer: true
});

export default {
  watch: {
    pendingScrollPosition(nV) {
      if (nV === 0) return;

      const scrollPoint = this.$store.state.scrollPoints[this.content.slug];
      this.$store.commit('setPendingScrollPosition', 0);

      window.scroll(0, scrollPoint.top + ((nV * 0.2) * this.$app.segmentHeight));

      setTimeout(() => { sound.seek(nV); }, 200);
     
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
  computed: {
    ...mapGetters([
      'currentTime', 'mediaPlaying', 'pendingScrollPosition'
    ]),
  },
  methods: {
    performSync: throttle(function (self) {

      sound.seek(self.currentTime);

    }, 1000),
  },
}
