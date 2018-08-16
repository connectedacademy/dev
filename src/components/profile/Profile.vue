<template lang="pug">

.profile-page

  .profile-action(v-if="(typeof profileAction !== 'undefined')")
    component(:is="profileAction.component" :label="profileAction.label" :role="profileAction.role" :panel="profileAction" :limitHeight="false" :can-expand="false" :expanded-view="true")
  
  .dashboard(transition-duration="0.3s" item-selector=".dashboard--item" gutter=".gutter-block-selector")&attributes({'v-masonry': 'true'})
    .gutter-block-selector
    .dashboard--item(v-masonry-tile="true")
      user(:style="panelStyle()" label="Profile" role="user")
    .dashboard--item(v-for="(panel, index) in panels" :key="index" v-if="isVisible(panel)" v-masonry-tile="true")
      component(:is="panel.component" :style="panelStyle()" :label="panel.label" :role="panel.role" :panel="panel" :limitHeight="true" :can-expand="true")

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import _each from 'lodash/each'
import _filter from 'lodash/filter'
import _indexOf from 'lodash/indexOf'

// Mixins
import Auth from '@/mixins/Auth'
import PageStyle from '@/mixins/PageStyle'

// Panels
import User from '@/components/profile/panels/User'
import Students from '@/components/profile/panels/Students'
import Submissions from '@/components/profile/panels/Submissions'
import Messages from '@/components/profile/panels/Messages'
import QuestionResponses from '@/components/profile/panels/QuestionResponses'
import Moderation from '@/components/profile/panels/Moderation'

export default {
  name: 'profile-main',
  mixins: [ Auth, PageStyle ],
  components: {
    User,
    Students,
    Submissions,
    Messages,
    QuestionResponses,
    Moderation
  },
  mounted() {
    this.redrawInterval = setInterval(() => {
      this.$redrawVueMasonry()
    }, 2000)

    // Listen for redraw event
    Events.$on('redrawMasonry', () => {
      this.$redrawVueMasonry()
      setTimeout(() => {
        this.$redrawVueMasonry()
      }, 1000)
    })
  },
  unmounted() {
    clearInterval(this.redrawInterval)
  },
  data() {
    return {
      contentPanelVisible: false,
      panelMargin: 10,
      panelWidth: 340,
      panels: [
        {
          role: 'user',
          label: 'Your Notes',
          component: 'messages',
        },
        {
          role: 'user',
          label: 'Your Responses',
          component: 'submissions',
        },
        {
          role: 'teacher',
          label: 'Class Notes',
          component: 'messages',
        },
        // {
        //   role: 'teacher',
        //   label: 'Class Responses',
        //   component: 'submissions',
        // },
        // {
        //   role: 'teacher',
        //   label: 'Class Storify',
        //   component: 'storify',
        // },
        {
          role: 'teacher',
          label: 'Class Students',
          component: 'students',
        },
        // {
        //   role: 'admin',
        //   label: 'Question Responses',
        //   component: 'question-responses',
        // },
        {
          role: 'admin',
          label: 'All Notes',
          component: 'messages',
        },
        // {
        //   role: 'admin',
        //   label: 'All Students',
        //   component: 'students',
        // },
        // {
        //   role: 'admin',
        //   label: 'All Responses',
        //   component: 'submissions',
        // },
        // {
        //   role: 'admin',
        //   label: 'Moderate',
        //   component: 'moderation',
        // },
      ],
    }
  },
  computed: {
    ...mapGetters(['user', 'profileAction', 'profileClass']),
    panelCount() {
      return _filter(this.panels, { visible: true }).length
    },
  },
  methods: {
    isVisible(panel) {
      // No user
      if (!this.user) return false
      // User has role
      if (this.user.roles[panel.role]) return true
      // Panel role is user
      if (panel.role === 'user') return true
    },
    panelStyle() {
      return {
        width: `${this.panelWidth - this.panelMargin}px`
      }
    },
    togglePanel(panel) {
      panel.visible = !panel.visible
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

$action-expanded-max-width = 500px

.visualisation-container
  pinned()
  background-color lighten($color-profile, 5%)
  position fixed
  top $navigation-height + $page-header-height
  z-index 1
  .visualisation
    top 50%
    transform translateY(-100px)
    margin-left auto
    margin-right auto
    width 80%
    position relative

// Profile action
.profile-action
  pinned()
  radius($corner-radius)
  background-color white
  overflow hidden
  top 40px
  bottom 40px
  overflow-y scroll
  position fixed
  z-index 56
  max-width $action-expanded-max-width
  left 50%
  margin-left -($action-expanded-max-width / 2)
  @media(max-width: $action-expanded-max-width)
    radius(0px)
    width 100%
    margin-left 0
    left 0
    bottom 0
      
// Dashboard
.dashboard
  padding $page-header-height 20px 20px 20px
  .gutter-block-selector
    width 20px
  .dashboard--item
    radius(6px)
    background-color white
    margin-bottom 20px
    overflow hidden
    &:first-child
      overflow visible
    h1
      reset()
</style>
