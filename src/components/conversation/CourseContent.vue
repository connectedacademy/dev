<template lang="pug">

.course-content-wrapper

  .course-content-group(v-if="releasedContent" v-for="(content, index) in releasedContent" v-bind:key="index" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

    homework(v-if="content.expectsubmission" v-bind:content="content")
    four-corners-banner(v-else-if="content.fourcornersintro")
    live-class(v-else-if="content.content_type === 'class'" v-bind:content="content" v-bind:id="'course-content-' + content.slug")
    deep-dive(v-else v-bind:content="content" v-bind:id="'course-content-' + content.slug" v-bind:current-class="currentClass")

  .course-content-group.course-content-group--future(v-if="futureContent" v-for="(content, index) in futureContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }" v-show="index === 0")
    
    next-class(v-if="content.content_type === 'nextclass'" v-bind:content="content")
    survey(v-else-if="content.content_type === 'survey'" v-bind:content="content")
    future-content(v-else v-bind:content="content")

</template>

<script>
import { mapGetters } from 'vuex'
import Auth from '@/mixins/Auth'

import _filter from 'lodash/filter'

import LiveClass from '@/components/conversation/LiveClass'
import DeepDive from '@/components/conversation/DeepDive'
import Homework from '@/components/conversation/Homework'
import FourCornersBanner from '@/components/conversation/FourCornersBanner'
import NextClass from '@/components/conversation/NextClass'
import Survey from '@/components/conversation/Survey'
import FutureContent from '@/components/conversation/FutureContent'

export default {
  name: 'course-content',
  mixins: [ Auth ],
  components: {
    LiveClass,
    DeepDive,
    Homework,
    FourCornersBanner,
    NextClass,
    Survey,
    FutureContent,
  },
  mounted() {
    this.viewCurrentClass()
  },
  watch: {
    course(nV) {
      this.viewCurrentClass()
    }
  },
  computed: {
    ...mapGetters([
      'course', 'currentClass', 'courseContent'
    ]),
    isIntroduction() {
      return (this.currentClass && (this.currentClass.slug === 'intro'))
    },
    releasedContent() {
      return _filter(this.courseContent, { status: 'RELEASED' })
    },
    futureContent() {
      return _filter(this.courseContent, { status: 'FUTURE' })
    }
  },
  methods: {
    viewCurrentClass() {
      // if (!this.course || !this.course.classes) return
      // for (const theClass of this.course.classes) {
      //   if (theClass.status === 'CURRENT') {
      //     this.$store.dispatch('getSpec', theClass.slug)
      //   }
      // }
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/layout/course-content'

</style>
