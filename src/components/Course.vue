<template lang="pug">

  .course-page(name="course-page")
    .col#col-main
      .main-container
        class-selector
        onboarding-prompt(identifier="intro-button" prompt="click for course intro" top="50" left="12" position="top-left" z-index="1")
        section-navigator
        course-content

</template>

<script>
// Mixins
import AutoScroll from '@/mixins/AutoScroll'
import PageStyle from '@/mixins/PageStyle'
import ScrollPoints from '@/mixins/ScrollPoints'

// Components
import CourseContent from '@/components/conversation/CourseContent'
import ClassSelector from '@/components/ClassSelector'
import SectionNavigator from '@/components/navigation/SectionNavigator'

export default {
  name: 'course',
  mixins: [ AutoScroll, PageStyle, ScrollPoints ],
  components: {
    ClassSelector,
    CourseContent,
    SectionNavigator,
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
    this.setScrollPoints()    
    window.scrollTo(0, this.$store.state.savedScrollPosition)
  },
  data() {
    return {
      pageStyle: { type: undefined, minimized: false }
    }
  },
  methods: {
    toMessage() {
      const segmentId = this.$route.params.segmentId
      if (segmentId) {
        this.$store.commit('EXPAND_CONVERSATION')
        const segmentGroup = parseInt(segmentId * 0.2)
        setTimeout(() => {
          this.$store.commit('SET_PEEK_SEGMENT', segmentGroup)
          this.$router.replace({ path: `/course/${this.$route.params.classSlug}/${this.$route.params.contentSlug}/${segmentId}` })
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

<style lang="stylus">

@import '~stylus/shared'

</style>
