
const SYNC_THRESHOLD = 2.0;

import Vue from 'vue';
import * as config from '@/api/config';
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
      initialBuffer: 0,
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


          // this.soundcloudPlayer.on('state-change', () => {
          //   this.$log.info('state');
          // });
          // this.soundcloudPlayer.on('play', () => {
          //   this.$log.info('play');
          // });
          // this.soundcloudPlayer.on('play-start', () => {
          //   this.$log.info('play');
          // });
          // this.soundcloudPlayer.on('play-resume', () => {
          //   this.$log.info('play');
          // });
          // this.soundcloudPlayer.on('pause', () => {
          //   this.$log.info('pause');
          // });
          // this.soundcloudPlayer.on('finish', () => {
          //   this.$log.info('finish');
          // });
          // this.soundcloudPlayer.on('seek', () => {
          //   this.$log.info('seek');
          // });
          // this.soundcloudPlayer.on('seeked', () => {
          //   this.$log.info('seeked');
          // });
          // this.soundcloudPlayer.on('geo_blocked', () => {
          //   this.$log.info('geo_blocked');
          // });
          // this.soundcloudPlayer.on('buffering_end', () => {
          //   this.$log.info('buffering_end');
          // });
          // this.soundcloudPlayer.on('audio_error', () => {
          //   this.$log.info('audio_error');
          // });
          // this.soundcloudPlayer.on('time', () => {
          //   this.$log.info('time');
          // });
          // this.soundcloudPlayer.on('no_streams', () => {
          //   this.$log.info('no_streams');
          // });
          // this.soundcloudPlayer.on('no_protocol', () => {
          //   this.$log.info('no_protocol');
          // });
          // this.soundcloudPlayer.on('no_connection', () => {
          //   this.$log.info('no_connection');
          // });


          this.soundcloudPlayer.on('time', () => {
            this.performSync(this);
          });
          this.soundcloudPlayer.on('seeked', () => {
            this.performSeeked(this);
          });
          this.soundcloudPlayer.on('buffering_start', () => {
            this.$log.info(this.initialBuffer);
            if (this.initialBuffer > 0) {
              this.$store.commit('PAUSE_MEDIA');
              this.mediaBuffering = true;
            } else {
              this.initialBuffer = (this.initialBuffer + 1);
            }
          });
          this.soundcloudPlayer.on('buffering_end', () => {
            this.mediaBuffering = false;
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
      const outOfSync = ((currentTime < (playerTime-SYNC_THRESHOLD)) || (currentTime > (playerTime + SYNC_THRESHOLD)));

      if (outOfSync) {
        self.$log.info('OUTOFSYNC');
        self.soundcloudPlayer.seek(currentTime * 1000);
      }

    }, 2000),
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
