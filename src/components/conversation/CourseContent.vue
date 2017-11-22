<template lang="pug">

.course-content-wrapper
  
  .course-content-group(v-if="releasedContent" v-for="(content, index) in releasedContent" v-bind:key="index" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }")

    homework(v-if="content.expectsubmission" v-bind:content="content")
    four-corners-banner(v-else-if="content.fourcornersintro")
    live-class(v-else-if="content.content_type === 'class'" v-bind:current-class="currentClass" v-bind:content="content" v-bind:id="'course-content-' + content.slug")
    deep-dive(v-else v-bind:content="content" v-bind:id="'course-content-' + content.slug")

  .course-content-group.course-content-group--future(v-if="futureContent && classReleased" v-for="(content, index) in futureContent" v-bind:class="{ optional: content.optional, [content.status.toLowerCase()]: true }" v-show="index === 0")
    
    next-class(v-if="content.content_type === 'nextclass'" v-bind:content="content")
    survey(v-else-if="content.content_type === 'survey'" v-bind:content="content")
    future-content(v-else v-bind:title="`${content.slug}`" v-bind:subtitle="`Will release at ${content.release_at}`")

  .course-content-group.course-content-group--future(v-if="!classReleased")
    future-content(title="Coming Soon" v-bind:subtitle="`Will be released ${fromNow(currentClass.release_at)}`")

</template>

<script>
import { mapGetters } from 'vuex'
import Auth from '@/mixins/Auth'
import Moment from 'moment-mini'

import _filter from 'lodash/filter'
import _includes from 'lodash/includes'

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
  props: [ 'currentClass' ],
  components: {
    LiveClass,
    DeepDive,
    Homework,
    FourCornersBanner,
    NextClass,
    Survey,
    FutureContent,
  },
  computed: {
    classReleased() {
      return (this.currentClass.status !== 'FUTURE')
    },
    courseContent() {
      return _filter(this.currentClass.content, item => {
        // Exclude titles from course content
        return !_includes(['title'], item.content_type)
      })
    },
    releasedContent() {
      return _filter(this.courseContent, { status: 'RELEASED' })
    },
    futureContent() {
      return _filter(this.courseContent, { status: 'FUTURE' })
    }
  },
  methods: {
    fromNow(date) {
      return Moment(date).fromNow()
    }
  }
}
</script>

<style lang="stylus">

@import '~stylus/layout/course-content'

</style>
