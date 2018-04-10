<template lang="pug">

  .class-page(name="class-page")
    live-class

</template>

<script>
const numberToWords = require('number-to-words')

import { mapGetters } from 'vuex'
import Moment from 'moment-mini'

import _findIndex from 'lodash/findIndex'
import _find from 'lodash/find'

// Mixins
import AutoScroll from '@/mixins/AutoScroll'
import PageStyle from '@/mixins/PageStyle'

// Components
import LiveClass from '@/components/live/LiveClass'

export default {
  name: 'live',
  mixins: [ AutoScroll, PageStyle ],
  components: {
    LiveClass
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('PAUSE_MEDIA')
    this.$store.dispatch('saveScrollPosition', window.scrollY)
    next()
  },
  mounted() {
    this.toMessage()
  },
  activated() {
    window.scrollTo(0, this.$store.state.scroll.savedScrollPosition)
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  methods: {
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toMessage() {
      const segmentId = this.$route.params.segmentId
      if (segmentId) {
        this.$store.commit('EXPAND_CONVERSATION')
        const segmentGroup = parseInt(segmentId)
        setTimeout(() => {
          this.$store.commit('SET_PEEK_SEGMENT', segmentGroup)
          this.$router.replace({ name: 'live', params: { segmentId: segmentId } });
          setTimeout(() => {
            var el = document.querySelector(".peek")
            if (typeof this.$refs.innerwrapper === 'undefined') return
            window.scroll(0, this.$refs.innerwrapper.offsetTop + parseInt(el.getAttribute('data-top')))
          }, 1000)
        }, 2000)
      }
    }
  }
}
</script>

