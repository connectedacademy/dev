<template lang="pug">
.class-content
  narrow-page-header(:title="currentClass.title" :subtitle="course.title")
  transition(name="fade" appear mode="out-in")
    router-view
</template>

<script>
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

// Mixins
import PageStyle from '@/mixins/PageStyle'

export default {
  name: 'class-content',
  mixins: [ PageStyle ],
  computed: {
    ...mapGetters(['course', 'currentClass'])
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

.class-content
  margin 0 auto
  max-width 1300px
  max-width 780px !important
  padding-top $navigation-height
  width calc(100% - 20px) !important
</style>
