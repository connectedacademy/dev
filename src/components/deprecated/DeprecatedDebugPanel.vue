<template lang="pug">

.debug-panel(v-if="this.$store.state.debug")
  span
    p scrollPoints
    pre {{ scrollPoints }}

  p {{ `subscribedTo - ${subscribedTo}` }}

  p {{ `mediaPlaying - ${mediaPlaying}` }}

</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'debug-panel',
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'scrollPoints',
      'subscribedTo',
      'mediaPlaying'
    ])
  },
  components: {},
  methods: {}
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.debug-panel
  background-color alpha(red, 0.8)
  color white
  max-width 300px
  min-width 200px
  padding 10px
  position fixed
  bottom 60px
  top 60px
  left 10px
  z-index 57
  overflow-y auto
  overflow-x none

</style>
