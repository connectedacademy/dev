<template lang="pug">

  .class-page(name="class-page")
    .col#col-main
      .main-container
        narrow-page-header(v-if="currentClass.loading" v-bind:title="currentClass.title" subtitle="Loading content..." link="View schedule" route="schedule")
        narrow-page-header(v-else v-bind:title="currentClass.title" v-bind:subtitle="classPosition" link="View schedule" route="schedule")
        section-navigator
        loading(v-if="currentClass && currentClass.loading")
        course-content(v-else-if="currentClass" v-bind:current-class="currentClass")

</template>

<script>
const numberToWords = require('number-to-words')

import { mapGetters } from 'vuex'
import Moment from 'moment-mini'

import _findIndex from 'lodash/findIndex'

// Mixins
import AutoScroll from '@/mixins/AutoScroll'
import PageStyle from '@/mixins/PageStyle'
import ScrollPoints from '@/mixins/ScrollPoints'

// Components
import Loading from '@/components/Loading'
import NarrowPageHeader from '@/components/NarrowPageHeader'
import SectionNavigator from '@/components/navigation/SectionNavigator'
import CourseContent from '@/components/conversation/CourseContent'

export default {
  name: 'class',
  mixins: [ AutoScroll, PageStyle, ScrollPoints ],
  components: {
    Loading,
    NarrowPageHeader,
    SectionNavigator,
    CourseContent
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('PAUSE_MEDIA')
    this.$store.dispatch('saveScrollPosition', window.scrollY)
    this.$store.dispatch('resetState')
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
    releaseLabel() {
      const label = (this.currentClass.status === 'FUTURE') ? 'Will be released' : 'Released'
      return `${label} ${Moment(this.currentClass.release_at).fromNow()}`
    },
    classPosition() {
      const classPosition = _findIndex(this.course.classes, { 'slug': this.currentClass.slug }) + 1
      const numberOfClasses = this.course.classes.length
      return `
        <a href="/#/schedule" style="color: white; text-decoration: none">
          ${this.jsUcfirst(numberToWords.toWordsOrdinal(classPosition))}
          of
          ${numberToWords.toWords(numberOfClasses)} classes
        </a>`
    },
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

