<template lang="pug">

  .prompt

    textarea(v-if="isEditing && editingMode === 'prompts'" placeholder="Write prompt..." v-model="currentPrompt" @focus="onFocus" @blur="saveEdit" ref="textarea")
    h1(v-else-if="prompt" v-html="prompt")
    h1(v-else) ...

</template>

<script>
import API from '@/api'
import { mapGetters } from 'vuex'
import { EventBus } from '@/event-bus.js'

export default {
  name: 'prompt',
  props: ['prompt', 'segmentGroup', 'isCurrent'],
  data () {
    return {
      currentPrompt: this.prompt
    }
  },
  watch: {
    prompt: function (nv) {
      this.currentPrompt = this.prompt
    }
  },
  computed: {
    ...mapGetters(['user', 'editingMode', 'isEditing'])
  },
  methods: {
    onFocus () {
      if (this.editingMode === 'prompts') {
        this.$store.commit('EDITING_SEGMENT', this.segmentGroup)
      }
    },
    onBlur () {
      this.$store.commit('EDITING_SEGMENT', undefined)
    },
    saveEdit() {
      API.message.updatePrompt({
        id: this.segmentGroup,
        text: this.currentPrompt,
        theClass: this.$route.params.classSlug
      },
      response => {
        // Pull new prompt
        // EventBus.$emit('promptsUpdated')
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

.prompt
  padding 15px 20px
  position relative
  h1, textarea
    font-size 1.2em
    font-weight bold
    font-style italic
    font-family 'Avenir', Helvetica, Arial, sans-serif
    @media(max-width: 600px)
      text-align center
  h1
    reset()
    color $color-text-grey
    text-align center
  textarea
    reset()
    border none
    color $color-text-grey
    height 114px 
    resize none
    width 100%
    &:focus
      outline 0
      color $color-warning
</style>
