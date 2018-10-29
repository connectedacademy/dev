import API from '@/api'

import { TweenLite } from 'gsap'

import _reject from 'lodash/reject'

export default {
  data() {
    return {
      visualisation: undefined,
      animations: [],
      maxAnimations: 30
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
      if (this.animations.length > this.maxAnimations) this.animations.pop()
    },
    loadVisualisation() {
      const theRequest = {
        theClass: this.classSlug,
        contentDuration: this.contentDuration
      }
      API.message.getVisualisation(
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

