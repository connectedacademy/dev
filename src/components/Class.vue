<template lang="pug">

  .class-page(name="class-page")
    .col#col-main
      .main-container
        narrow-page-header(v-show="!currentClass.loading" v-bind:title="currentClass.title" v-bind:subtitle="`Released ${releaseAt(currentClass.release_at)}`" v-bind:link="`1 of ${course.classes.length} classes`" route="schedule")
        section-navigator
        loading(v-if="currentClass.loading")
        course-content(v-else v-bind:current-class="currentClass")

</template>

<script>
import { mapGetters } from 'vuex'
import Moment from 'moment-mini'

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
    this.$store.dispatch('saveScrollPosition', window.scrollY)
    this.$store.dispatch('resetState')
    next()
  },
  mounted() {
    this.toMessage()
  },
  activated() {
    window.scrollTo(0, this.$store.state.savedScrollPosition)
  },
  data() {
    return {
      pageStyle: { type: undefined, visible: true, minimized: false }
    }
  },
  computed: {
    ...mapGetters(['course', 'currentClass'])
  },
  methods: {
    releaseAt(date) {
      // return Moment(date).format('ddd d MMMM YYYY hh:MM:SS')
      return Moment(date).fromNow()
    },
    toMessage() {
      const segmentId = this.$route.params.segmentId
      if (segmentId) {
        this.$store.commit('EXPAND_CONVERSATION')
        const segmentGroup = parseInt(segmentId * 0.2)
        setTimeout(() => {
          this.$store.commit('SET_PEEK_SEGMENT', segmentGroup)
          this.$router.replace({ name: 'class', params: { classSlug: this.$route.params.classSlug, contentSlug: this.$route.params.contentSlug, segmentId: segmentId } });
          setTimeout(() => {
            var el = document.querySelector(".peek")
            window.scroll(0, this.$refs.innerwrapper.offsetTop + parseInt(el.getAttribute('data-top')))
          }, 1000)
        }, 2000)
      }
    }
  }
}
</script>

