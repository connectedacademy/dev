<template lang="pug">

  .class-page(name="class-page")
    //- transition(name="fade" appear mode="out-in")
    #mentions-banner(v-if="mentions.length > 0")
      .mention(v-for="(mention, index) in mentions" :key="index" @click="viewMention(mention)")
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
    if (this.$route.params.segmentId) {
      this.jumpToSegment(this.$route.params.segmentId)
    }
    EventBus.$on('mention', (message) => {
      console.log('mention', message)
      this.mentions.push(message)
      setTimeout(() => {
        this.mentions.splice(0, 1)
      }, 5000)
    })
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false },
      mentions: []
    }
  },
  methods: {
    jsUcfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    viewMention(mention) {
      this.$router.push({ name: 'live', params: { classSlug: mention.class, contentSlug: 'liveclass', segmentId: mention.segment } })
      const segmentGroup = parseInt(mention.segment)
      this.jumpToSegment(segmentGroup)
    },
    jumpToSegment(segmentId) {
      this.$store.commit('EXPAND_CONVERSATION')
      // Scroll to segment group
      const segmentGroup = parseInt(segmentId)
      setTimeout(() => {
        this.$store.commit('SET_PEEK_SEGMENT', segmentGroup)
        var el = document.querySelector(".peek")
        if (typeof this.$refs.innerwrapper === 'undefined') return
        window.scroll(0, this.$refs.innerwrapper.offsetTop + parseInt(el.getAttribute('data-top')))
      }, 500)
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
  position fixed
  bottom auto
  z-index 999
  .mention
    animate()
    background-color alpha($color-success, 0.7)
    color white
    display block
    line-height 40px
    padding 10px
    min-height 40px
    text-align center
    &:hover
      background-color alpha($color-success, 0.9)
      cursor pointer
</style>
