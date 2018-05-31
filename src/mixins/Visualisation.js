import Vue from 'vue'
import API from '@/api'
import * as config from '@/api/config'

import { TweenLite } from 'gsap'

import _each from 'lodash/each'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _mean from 'lodash/mean'
import _take from 'lodash/take'
import _reject from 'lodash/reject'

export default {
  data() {
    return {
      visualisation: undefined,
      animations: []
    }
  },
  methods: {
    pushAnimation(segment) {
      // Create animation
      const key = Math.floor((segment / (1800 / 5)) * 100)
      const animation = { x: key }

      // Put new animation at start of array
      this.animations = _reject(this.animations, o => { return o.x === animation.x })
      this.animations.unshift(animation)

      // Limit number of animations
      if (this.animations.length > 10) this.animations.pop()
    },
    loadVisualisation() {
      const url = `${config.WATERCOOLER_API}/messages/vis/${this.classSlug}/${this.contentDuration}`
      Vue.http.get(url).then((response) => {
        this.setVisualisation(response.body.visualisation)
      }, (response) => {
        // Handle error
      })
    },
    setVisualisation(values) {
      if (!this.$data.visualisation) {
        this.visualisation = values
        return
      }
      TweenLite.to(this.$data.visualisation, 2, values)
    }
  }
}

