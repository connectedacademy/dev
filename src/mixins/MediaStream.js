
const SYNC_THRESHOLD = 2.0;

import Vue from 'vue';
import * as config from '@/api/config';
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

import SoundCloud from 'soundcloud';

import throttle from 'lodash/throttle';

export default {
  mounted() {
    setTimeout(() => {
      this.initializeSoundcloudPlayer();
    }, 2500);
  },
  beforeDestroy() {
    this.soundcloudPlayer = undefined;
  },
  watch: {
    pendingScrollPosition(nV) {
      if (nV === 0) return;

      const scrollPoint = this.$store.state.scrollPoints[this.content.slug];
      this.$store.commit('setPendingScrollPosition', 0);

      window.scroll(0, scrollPoint.top + ((nV * 0.2) * this.$app.segmentHeight));

      setTimeout(() => {
        this.soundcloudPlayer.seek(nV * 1000);
      }, 300);
    },
    mediaPlaying(nv, oV) {
      if (nv) {
        if (this.playerType === 'youtube' && this.player) this.player.playVideo();
        if (this.playerType === 'soundcloud' && this.soundcloudPlayer) this.soundcloudPlayer.play();
      } else {
        if (this.playerType === 'youtube' && this.player) this.player.pauseVideo();
        if (this.playerType === 'soundcloud' && this.soundcloudPlayer) this.soundcloudPlayer.pause();
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
      soundcloudPlayer: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'course', 'currentTime', 'mediaPlaying', 'media', 'pendingScrollPosition', 'peekSegment'
    ]),
    src() {
      switch (this.playerType) {
        case 'youtube':
          return (this.content) ? this.content.videoId : '';
          break;
        case 'soundcloud':
          return (this.content) ? `/tracks/${this.content.soundcloudId}` : '';
          break;
      }
    },
  },
  methods: {
    initializeSoundcloudPlayer() {
      this.$log.info('initializeSoundcloudPlayer');
      if (!this.soundcloudPlayer && this.src) {
        SoundCloud.initialize({
          client_id: config.SOUNCLOUD_CLIENT_ID,
        });
        SoundCloud.stream(this.src).then((player) => {
          this.soundcloudPlayer = player;
          this.soundcloudPlayer.on('time', () => {
            this.performSync(this);
          });
          this.soundcloudPlayer.on('seeked', () => {
            this.performSeeked(this);
          });
          this.soundcloudPlayer.on('play-resume', () => {
            // this.performSeeked(this);
            this.$store.commit('PLAY_MEDIA');
          });
          
          this.soundcloudPlayer.on('buffering_start', () => {
            this.mediaBuffering = true;
            this.$store.commit('PAUSE_MEDIA');
          });
          this.soundcloudPlayer.on('buffering_end', () => {
            setTimeout(() => {
              this.mediaBuffering = false;
            }, 500);
          });
        });
      }
    },
    performSync: throttle(function (self) {
      self.$log.info('time');
      if (!self.soundcloudPlayer) return;

      const currentTime = self.currentTime;
      if (!currentTime || !self.videoIsActive) {
        self.$store.commit('PAUSE_MEDIA');
        return;
      }
      const playerTime = self.soundcloudPlayer.currentTime() / 1000;
      const outOfSync = ((currentTime < (playerTime - SYNC_THRESHOLD)) || (currentTime > (playerTime + SYNC_THRESHOLD)));

      if (outOfSync) {
        self.$log.info('OUTOFSYNC');
        self.soundcloudPlayer.seek(currentTime * 1000);
      }

    }, 1000),
    performSeeked: throttle(function (self) {
      this.$log.info('seeked');
      setTimeout(() => {
        if (!(this.peekSegment || this.activeSegment)) {
          this.$store.commit('PLAY_MEDIA');
        }
      }, 500);
    }, 1000),
  },
}
