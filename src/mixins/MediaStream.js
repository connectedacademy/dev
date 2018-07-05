const SYNC_THRESHOLD = 2.0

import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

import _get from 'lodash/get'
import _inRange from 'lodash/inRange'
import _throttle from 'lodash/throttle'

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
    if (typeof this.content.audio === 'undefined') return
    
    let src = []

    for (const url of this.content.audio) {
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

        this.attemptSync(this)
      })

      // If the audio seeks then check it is buffered
      this.sound.on('load', () => {

        console.log('Sound has loaded')

        // Set sprites
        this.sound._sprite = {
          'full': [0, (this.sound._duration * 5000), false]
        }
      })

      // If the audio seeks then check it is buffered
      this.sound.on('seek', () => {
        this.checkBufferStatus(this)
      })

      // Each time a sound loops, reduce speed
      // this.sound.on('end', (id) => {
      //   if (id  === 'full') return
      //   const adjustment = 1.2
      //   let newRate = this.sound.rate() / adjustment
      //   if (newRate < 1.0) {
      //     this.sound.rate(1.0, id)
      //   } else {
      //     this.sound.rate(newRate, id)
      //   }
      // })

    }
  },
  watch: {
    mediaPlaying(nV) {
      console.log('mediaPlaying', nV)
      
      console.log('this.sound', this.sound)
      
      if (nV) {
        this.mainSoundId = this.sound.play('full')
      }
      else {
        this.sound.pause(this.mainSoundId)
      }
    },
    peekSegment(nV) {
      if (!nV) return
      this.$store.commit('PAUSE_MEDIA')
    },
    editingSegment(nV) {
      
      this.sound.stop()
      
      console.log('editingSegment', this.editingSegment)
      
      if (typeof nV === 'undefined') {
        
        this.sound.pause()

      } else {
        
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
      bufferedSegments: undefined,
      mainSoundId: undefined
    }
  },
  computed: {
    ...mapGetters(['CDN', 'mediaPlaying', 'editingSegment'])
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
    attemptSync: _throttle(function (self) {
      
      
      if (typeof self.editingSegment !== 'undefined') {
        this.$log.error('Currently editing a segment')
        return
      }

      if (self.sound._sounds.length === 0) {
        this.$log.error('No sound loaded')
        return
      }

      const playerTime = self.sound.seek(this.mainSoundId)
      
      const inSync = _inRange(self.scrollStatus.currentTime, playerTime - SYNC_THRESHOLD, playerTime + SYNC_THRESHOLD)

      if (!inSync) {
        self.$log.info(`Audio not in sync, seeking to ${self.scrollStatus.currentTime}`)
        self.sound.seek(parseInt(self.scrollStatus.currentTime), this.mainSoundId)
      }
    }, 1000)
  }
}
