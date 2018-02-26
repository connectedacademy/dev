<template lang="pug">

.profile-panel(v-bind:class="{ limited: limitHeight }")

  profile-panel-header(v-bind:label="label" v-on:refresh="loadData" v-on:expand="expand" can-refresh v-bind:can-expand="canExpand")

  .profile-panel--content
    .no-results(v-if="responses.length === 0") {{ $t('common.no_results') }}
    ul
      li(v-for="(response, index) in responses" v-bind:key="index" v-if="(limitHeight && (index < 4)) || !limitHeight")
        //- pre {{ response }}
        h3 Q: {{ response.text }}
        p(v-for="(answer, key) in response.answers") {{ key }} - {{ answer }}
        //- p A: {{ response.answers.length }}
        //- div(v-if="response.question.response_type === 'text'")
        //-   p(v-for="answer in response.answers")
        //-     | {{ answer }}
        //- div(v-else-if="response.question.response_type === 'boolean'")
        //-   p True : {{ response.totals.true ? response.totals.true : 0 }}
        //-   p False : {{ response.totals.false ? response.totals.false : 0 }}
        //- div(v-else-if="response.question.response_type === 'scale'")
        //-   p Average : {{ response.mean ? response.mean : 'N/A' }}
        //- div(v-else)
        //-   pre {{ response }}


</template>

<script>
import API from '@/api'
import { EventBus } from '@/event-bus.js'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'

export default {
  name: 'question-responses',
  props: ['label', 'role', 'limitHeight', 'canExpand', 'expandedView'],
  components: {
    ProfilePanelHeader,
  },
  mounted() {
    if (this.expandedView) { this.loadData() }
    EventBus.$on('profileClassUpdated', () => {
      this.loadData()
    })
  },
  data() {
    return {
      responses: []
    }
  },
  methods: {
    expand() {
      this.$store.commit('updateProfileAction', this.panel)
    },
    loadData() {

      this.responses = []

      const request = {}

      API.question.getQuestionResponses(
        request,
        (response) => {
          this.responses = response
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve question responses')
          this.responses = []
        }
      )
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

.profile-panel

  .profile-panel--content
    padding 15px
    ul
      cleanlist()
      li
        cleanlist()
        margin-bottom 30px
        &:last-child
          margin-bottom 0
        h3
          reset()
          color $color-text-dark-grey
          font-size 0.9em
          font-weight normal
          margin-bottom 10px
        p
          reset()
          color $color-text-grey
          font-size 0.9em
          font-weight bold

</style>
