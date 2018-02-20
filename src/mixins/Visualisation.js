import Vue from 'vue'
import API from '@/api'
import * as config from '@/api/config'

import { TweenLite } from 'gsap'

import _each from 'lodash/each'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _mean from 'lodash/mean'
import _take from 'lodash/take'

export default {
  data() {
    return {
      visualisation: undefined
    }
  },
  methods: {
    loadVisualisation(isSocket) {

      const segmentSize = 5
      const request = { class: this.classSlug, content: this.contentSlug, duration: parseInt(this.contentDuration / segmentSize) }
      // lin, log, raw
      const url = `${config.WATERCOOLER_API}/messages/visualisation/${request.class}/${request.content}/1/${request.duration}?whitelist=true&clearcache=false&scale=log`
      
      if (isSocket) {
        
        // Subscribe to visualisation socket
        this.$io.socket.get(url, (resData, jwres) => {
          this.setVisualisation(resData.data, false)
        })
      }
      else {
        // lin, log, raw
        Vue.http.get(url).then((response) => {
          this.setVisualisation(response.data.data, true)
        }, (response) => {
          // Handle error
        });
      }
    },
    setVisualisation(values, tween) {

      values = _values(values)

      let result = []
      let chunk = values.length / 100;

      for (var i = 0; i < values.length; i += chunk) {
        result.push(values.slice(i, i + chunk));
      }
      result = _map(result, (r, key) => {
        const mean = (typeof key === 'number') ? _mean(r) : 0
        return (mean === 0) ? 0.05 : mean
      })
      let newresult = {}
      _each(result, (r, index) => {
        newresult[index] = r
      })

      if (tween) {
        TweenLite.to(
          this.$data.visualisation,
          0.2,
          newresult
        )
      }
      else {
        this.visualisation = newresult
      }
    }
  }
}

