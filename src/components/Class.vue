<template lang="pug">

  .class-page(name="class-page")
    .col#col-main
      .main-container
        narrow-page-header(v-if="currentClass.loading" v-bind:title="currentClass.title" subtitle="One moment.." link="" route="schedule")
        narrow-page-header(v-else v-bind:title="currentClass.title" v-bind:subtitle="`Explore other content`" v-bind:link="liveListenerCount")
        loading(v-if="currentClass && currentClass.loading")
        live-class(v-else v-bind:current-class="currentClass" v-bind:content="content" v-bind:id="'course-content-' + content.slug")

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
import Loading from '@/components/Loading'
import NarrowPageHeader from '@/components/NarrowPageHeader'
import LiveClass from '@/components/conversation/LiveClass'

export default {
  name: 'class',
  mixins: [ AutoScroll, PageStyle ],
  components: {
    Loading,
    NarrowPageHeader,
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
  computed: {
    ...mapGetters(['course', 'currentClass']),
    content () {
      return _find(this.currentClass.content, { content_type: 'class' })
    },
    classPosition () {
      const classPosition = _findIndex(this.course.classes, { 'slug': this.currentClass.slug }) + 1
      const numberOfClasses = this.course.classes.length
      return `
        <a href="/#/schedule" style="color: white; text-decoration: none">
          ${this.jsUcfirst(numberToWords.toWordsOrdinal(classPosition))}
          of
          ${numberToWords.toWords(numberOfClasses)} classes
        </a>`
    },
    liveListenerCount () {
      const listenerCount = Math.floor(Math.random() * 100) // TODO: Caluclate correctly
      return `${listenerCount} Live Listeners`
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
          this.$router.replace({ name: 'class', params: { classSlug: this.$route.params.classSlug, contentSlug: this.$route.params.contentSlug, segmentId: segmentId } });
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

