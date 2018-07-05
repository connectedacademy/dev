<template lang="pug">

  .transcript

    textarea(v-if="editingMode === 'transcript'" placeholder="Write transcript..." v-model="currentTranscript" @focus="onFocus" @blur="saveEdit" ref="textarea")
    h1(v-else-if="transcript" v-html="transcript")
    h1(v-else) ...

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'transcript',
  props: ['transcript', 'segmentGroup', 'isCurrent'],
  data () {
    return {
      currentTranscript: this.transcript
    }
  },
  watch: {
    transcript: function (nv) {
      this.currentTranscript = this.transcript
    }
  },
  computed: {
    ...mapGetters(['user', 'editingMode'])
  },
  methods: {
    onFocus () {
      console.log('onFocus')
      
      this.$store.commit('EDITING_SEGMENT', this.segmentGroup)
    },
    saveEdit() {
      API.message.updateTranscript({
        id: this.segmentGroup,
        text: this.currentTranscript,
        theClass: this.$route.params.classSlug
      },
      response => {
        // Pull new transcript
        // EventBus.$emit('transcriptUpdated')
      },
      response => {
        console.log('Failed to save!')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~stylus/shared'

.transcript
  padding 15px 20px
  position relative
  h1, textarea
    font-size 1.1em
    font-weight bold
    font-family 'Avenir', Helvetica, Arial, sans-serif
    @media(max-width: 600px)
      text-align center
  h1
    reset()
    color #444
  textarea
    reset()
    border none
    color $color-text-dark-grey
    height 114px 
    resize none
    width 100%
    &:focus
      outline 0
      color $color-warning
</style>
