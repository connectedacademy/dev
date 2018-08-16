<template lang="pug">
  
  .drawer.editing-drawer(v-if="enabled && editableContent" :class="{ visible: isVisible }")

    #toggle-button(@click="toggleEditor")
      icon(:icon="isVisible ? 'arrow-left' : 'cog'")

    transition(name="slide-top" type="in out")
      .flash-message(v-if="recentlyUpdated") Content Updated

    .wrapper(v-if="editableContent && isVisible")

      .container
        edit-course(v-if="$route.name === 'home'")

        edit-page(v-if="type === 'page'" v-for="(page, index) in editableContent.pages" :key="index" :index="index" :page="page")

        edit-liveclass(v-if="type === 'live'" :liveclass="liveClass")
        
        edit-schedule(v-if="type === 'schedule'" v-for="(item, index) in editableContent.schedule" :key="index" :index="index" :item="item")
        .subtle-text(v-if="type === 'schedule'") *Support for adding and reordering of classes will be available soon
        
        edit-content(v-if="type === 'content'" v-for="(item, index) in editableContent.content" :key="index" :index="index" :item="item")
        .subtle-text(v-if="type === 'content'") *Support for adding and reordering of content will be available soon
      
</template>

<script>
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import EditCourse from '@/components/editor/EditCourse'
import EditLiveclass from '@/components/editor/EditLiveclass'
import EditPage from '@/components/editor/EditPage'
import EditSchedule from '@/components/editor/EditSchedule'
import EditContent from '@/components/editor/EditContent'

import _get from 'lodash/get'

export default {
  name: 'editing-drawer',
  components: {
    EditCourse,
    EditLiveclass,
    EditPage,
    EditSchedule,
    EditContent
  },
  mounted() {
    Events.$on('contentUpdated', (type) => {
      this.recentlyUpdated = true
      setTimeout(() => {
        this.recentlyUpdated = false
      }, 1500)
    })
  },
  data() {
    return {
      recentlyUpdated: false
    }
  },
  computed: {
    ...mapGetters(['user', 'course', 'currentClass', 'liveClass']),
    enabled () {
      return this.user && this.user.roles.admin
    },
    isVisible() {
      return this.$store.state.navigation.editingDrawer.visible
    },
    type() {
      return _get(this.$route, 'meta.editable.type', undefined)
    },
    editableContent() {
      const path = _get(this.$route, 'meta.editable.path', undefined)
      let content = { type: this.type }
      switch (this.type) {
        case 'live':
          return { ...content, liveclass: this.liveClass }

        case 'schedule':
          return { ...content, schedule: this.course.classes }

        case 'content':
          return { ...content, content: this.currentClass.content }
        
        case 'page':
          return { ...content, pages: [{
            title: this.$route.name,
            path: path || `content/${this.$route.name}.md`
          }]}
        
        case 'markdown':
          return { ...content, pages: [{
            path: `classes/${this.$route.params.classSlug}/${this.$route.params.url}.md`
          }]}

        default:
          return undefined
      }
    }
  },
  methods: {
    toggleEditor() {
      Events.$emit('editorOpened')
      this.$store.commit('TOGGLE_EDITING_DRAWER')
    }
  }
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/buttons'

$drawer-width = 400px

.drawer.editing-drawer
  animate()
  box-shadow-dark()
  background-color white
  position fixed
  left -400px
  top 0
  bottom 0
  max-width 100%
  width $drawer-width
  z-index 56

  .flash-message
    animate()
    // radius(6px)
    background-color alpha($color-success, 1)
    color white
    font-weight bold
    line-height 60px
    padding 0 10px
    position fixed
    top 0
    left 0
    right 0
    z-index 9
    text-align center
  .wrapper
    overflow-y scroll
    padding-bottom 100px
    position absolute
    top 0
    bottom 0
    left 0
    right 0
  .wrapper .container
    padding 15px
    text-align left
    &:not(:first-child)
      border-top $color-border 1px solid
    h4
      reset()
      margin-bottom 10px
      text-align center

  #toggle-button
    animate()
    radius(12px)
    background-color $color-info
    color white
    font-weight bold
    height 24px
    padding 10px
    padding-left 20px
    position fixed
    bottom 20px
    left -10px
    z-index 52
    svg
      height 24px
      width 24px
    &:hover
      background-color darken($color-info, 10%)
      cursor pointer

  &.visible
    left 0
    outline $color-border 1px solid
    #toggle-button
      radius(50%)
      background-color $color-info
      left 340px
      padding-left 10px
      @media(max-width: 400px)
        left calc(100% - 60px)
</style>
