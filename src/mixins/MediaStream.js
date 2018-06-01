const SYNC_THRESHOLD = 2.0

import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import _get from 'lodash/get'
import _inRange from 'lodash/inRange'
import _throttle from 'lodash/throttle'
import _find from 'lodash/find'

require('howler')

export default {
  beforeDestroy() {
    try {
      this.sound.unload()
    } catch (error) {
      console.error(error);
      
    }
  },
  mounted() {
    console.log('this.content.audio')
    console.log(this.content.audio)
    
    if (typeof this.content.audio === 'undefined') return
    
    let src = []

    // Grab audio files for class
    for (const index in this.content.audio) {
      const url = `${this.course.cdn}/audio/${this.content.audio[index]}`
      if (this.fileExists(url)) {
        src.push(url)
      }
    }

    if (src.length > 0) {

      // Create Howl instance
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
        this.checkBufferStatus(this)
      })
    }
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
      bufferedSegments: undefined
    }
  },
  computed: {
    ...mapGetters(['course', 'mediaPlaying'])
  },
  methods: {
    fileExists (url) {
      let http = new XMLHttpRequest()
      http.open('HEAD', url, false)
      http.send()
      return http.status != 404
    },
    checkBufferStatus: _throttle(function (self) {    

      if (!self.scrollStatus) return
      if (typeof _get(self.sound._sounds) === 'undefined') return
      if (self.sound._sounds.length === 0) return
      
      // Get buffered blocks
      const buffered = self.sound._sounds[0]._node.buffered

      self.bufferedSegments = buffered

      // Loop through buffered blocks
      for (var index = 0; index < buffered.length; index++) {

        // Check if current time in audio has been buffered
        if (_inRange(self.scrollStatus.currentTime, buffered.start(index), buffered.end(index))) {
          self.bufferInterval = false
          self.mediaBuffering = false
          self.checkBufferStatus(self)
          return
        }
      }

      // Media is buffering so wait and check again
      self.mediaBuffering = true
      self.checkBufferStatus(self)
    }, 2000),
    attempSync: _throttle(function (self) {

      if (self.sound._sounds.length === 0) {
        this.$log.error('No sound loaded')
        return
      }

      const playerTime = self.sound.seek()
      const inSync = _inRange(self.scrollStatus.currentTime, playerTime - SYNC_THRESHOLD, playerTime + SYNC_THRESHOLD)

      if (!inSync) {
        self.$log.info(`Audio not in sync, seeking to ${self.scrollStatus.currentTime}`)
        self.sound.seek(self.scrollStatus.currentTime)
      }
    }, 500)
  }
}
