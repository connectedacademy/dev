const SYNC_THRESHOLD = 3.0

import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import _get from 'lodash/get'
import _inRange from 'lodash/inRange'
import _throttle from 'lodash/throttle'

require('howler')

export default {
  beforeDestroy() {
    try {
      if (this.sound) {
        this.sound.unload()

      }
    } catch (error) {
      console.error(error);
    }
  },
  mounted() {
    if (!this.content.audio) return
    
    let src = []
    
    for (const url of this.content.audio) {
      src.push(url)
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
      Events.$on('scrollStatus', (scrollStatus) => {
        this.scrollStatus = scrollStatus

        this.attemptSync(this)
      })

      // If the audio seeks then check it is buffered
      this.sound.once('load', function () {
        console.log('Sound has loaded')
      })

      // If the audio seeks then check it is buffered
      this.sound.on('seek', () => {
        this.checkBufferStatus(this)
      })

      // Each time a sound loops, reduce speed
      this.sound.on('end', (id) => {
        if (id  === 'segment') {
          const adjustment = 1.2
          let newRate = this.sound.rate() / adjustment
          if (newRate < 1.0) {
            this.sound.rate(1.0, id)
          } else {
            this.sound.rate(newRate, id)
          }
        }
      })
    }
  },
  watch: {
    mediaPlaying(nV) {
      if (!this.sound) return
      
      if (nV) {
        if (!this.editingSegment) {
          this.sound.play()
        } else {
          console.log('Editing segment')
          
        }
      }
      else {
        if (!this.editingSegment) {
          this.sound.pause()
        }
      }
    },
    peekSegment(nV) {
      if (!nV) return
      this.$store.commit('PAUSE_MEDIA')
    },
    editingSegment(nV) {
      
      if (!this.sound) return

      this.sound.stop()
      
      if (this.editingMode === 'media') {
        console.log('this.sound.stop()')

        return
      }

      if (typeof nV === 'undefined') {
        this.sound.pause()
      } else if (this.editingMode === 'transcript') {
        
        const loop = true
        const bleed = 1000 // Sound to play before and after segment
        const segmentDuration = 5000

        let offset = (nV * segmentDuration) - bleed

        this.sound._sprite = {
          'segment': [offset, segmentDuration + (bleed * 2), loop]
        }

        this.sound.play('segment')
      }
    }
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
    ...mapGetters(['CDN', 'mediaPlaying', 'editingSegment', 'editingMode'])
  },
  methods: {
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
    attemptSync: _throttle(function (self) {
      
      
      if (typeof self.editingSegment !== 'undefined') {
        this.$log.error('Currently editing a segment')
        return
      }

      if (self.sound._sounds.length === 0) {
        this.$log.error('No sound loaded')
        return
      }

      const playerTime = self.sound.seek()
      
      const inSync = _inRange(self.scrollStatus.currentTime, playerTime - SYNC_THRESHOLD, playerTime + SYNC_THRESHOLD)

      if (inSync) return
      self.$log.info(`Audio not in sync, seeking to ${self.scrollStatus.currentTime}`)
      self.sound.seek(self.scrollStatus.currentTime)
    }, 1000)
  }
}
