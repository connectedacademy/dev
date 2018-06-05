import API from '@/api'

import { TweenLite } from 'gsap'

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
      const key = Math.floor((segment / (this.contentDuration / 5)) * 100)
      const animation = { x: key }

      // Put new animation at start of array
      this.animations = _reject(this.animations, o => { return o.x === animation.x })
      this.animations.unshift(animation)

      // Limit number of animations
      if (this.animations.length > 10) this.animations.pop()
    },
    loadVisualisation() {
      const theRequest = {
        theClass: this.classSlug,
        contentDuration: this.contentDuration
      }
      API.message.getVisulation(
        theRequest,
        (response) => {
          this.setVisualisation(response.visualisation)
        },
        (response) => {
          // Handle error
        }
      )
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

