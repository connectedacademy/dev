const SYNC_THRESHOLD = 2.0

import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import _inRange from 'lodash/inRange'
import _throttle from 'lodash/throttle'
import _find from 'lodash/find'

require('howler')

export default {
  mounted() {
    if (typeof this.content.audio === 'undefined') return
    
    let src = []

    // Grab audio files for class
    for (const index in this.content.audio) {
      src.push(`${this.course.baseUri}../audio/${this.content.audio[index]}`,)
    }
    
    // Initialise Howler
    this.sound = new Howl({
      src: src,
      preload: true,
      html5: true,
      buffer: true
    })

    // Update scroll status and keep audio in sync
    EventBus.$on('scrollStatus', (scrollStatus) => {
      this.scrollStatus = scrollStatus
      this.attempSync(this)
    })

    // If the audio seeks then check it is buffered
    this.sound.on('seek', () => {
     this.checkBufferStatus()
    })
  },
  watch: {
    mediaPlaying(nV, oV) {
      if (nV) {
        this.sound.play()
      }
      else {
        this.sound.pause()
      }
    },
    peekSegment(nV) {
      if (!nV) return
      this.$store.commit('PAUSE_MEDIA')
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
    ...mapGetters(['course', 'mediaPlaying'])
  },
  methods: {
    checkBufferStatus() {

      if (!self.scrollStatus) return

      // Get buffered blocks
      const buffered = this.sound._sounds[0]._node.buffered

      // Loop through buffered blocks
      for (var index = 0; index < buffered.length; index++) {

        // Check if current time in audio has been buffered
        if (_inRange(this.scrollStatus.currentTime, buffered.start(index), buffered.end(index))) {
          this.bufferInterval = false
          this.mediaBuffering = false
          return
        }
      }

      // Media is buffering so wait and check again
      this.mediaBuffering = true
      setTimeout(() => { this.checkBufferStatus() }, 500)
    },
    attempSync: _throttle(function (self) {

      const playerTime = this.sound.seek()
      const inSync = _inRange(self.scrollStatus.currentTime, playerTime - SYNC_THRESHOLD, playerTime + SYNC_THRESHOLD)

      if (!inSync) {
        self.$log.info('Audio not in sync')
        this.sound.seek(self.scrollStatus.currentTime)
      }
    }, 500)
  }
}
