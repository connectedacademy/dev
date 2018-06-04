<template lang="pug">

  .class-page(name="class-page")
    transition(name="fade" appear mode="out-in")
      #mentions-banner(v-if="mention" @click="viewMention()")
        .mention
          | You were mentioned by {{ mention._user.profile.name }}
    live-class

</template>

<script>
const numberToWords = require('number-to-words')

import { EventBus } from '@/event-bus.js'
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
    next()
  },
  mounted() {
    this.toMessage()
    EventBus.$on('mention', (message) => {
      console.log('mention', message)
      this.mention = message
      setTimeout(() => {
        this.mention = undefined
      }, 2000)
    })
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false },
      mention: undefined
    }
  },
  methods: {
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    viewMention() {
      this.$router.push({ name: 'live', params: { classSlug: this.mention.class, contentSlug: 'liveclass', segmentId: this.mention.segment } })
      this.$store.commit('EXPAND_CONVERSATION')
      // Scroll to segment group
      const segmentGroup = parseInt(this.mention.segment)
      setTimeout(() => {
        this.$store.commit('SET_PEEK_SEGMENT', segmentGroup)
        var el = document.querySelector(".peek")
        if (typeof this.$refs.innerwrapper === 'undefined') return
        window.scroll(0, this.$refs.innerwrapper.offsetTop + parseInt(el.getAttribute('data-top')))
      }, 500)
    },
    toMessage() {
      const segmentId = this.$route.params.segmentId
      if (segmentId) {
        this.$store.commit('EXPAND_CONVERSATION')
        // Scroll to segment group
        const segmentGroup = parseInt(segmentId)
        setTimeout(() => {
          this.$store.commit('SET_PEEK_SEGMENT', segmentGroup)
          var el = document.querySelector(".peek")
          if (typeof this.$refs.innerwrapper === 'undefined') return
          window.scroll(0, this.$refs.innerwrapper.offsetTop + parseInt(el.getAttribute('data-top')))
        }, 500)
      } else {
        window.scrollTo(0, 0)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

@media(max-width 600px)
  .class-page
    margin 0 -10px
  
#mentions-banner
  pinned()
  background-color alpha($color-info, 0.8)
  color white
  position fixed
  bottom auto
  line-height 60px
  height 60px
  z-index 999
  text-align center

</style>
