<template lang="pug">

.profile-page
  
  page-header(title="Your Dashboard" identifier="profile")

    //- Class Selector
    profile-class-selector(v-bind:classes.sync="classes")

  .profile-action(v-if="(typeof profileAction !== 'undefined')")
    component(v-bind:is="profileAction.component" v-bind:label="profileAction.label" v-bind:role="profileAction.role" v-bind:panel="profileAction" v-bind:classes="classes" v-bind:limitHeight="false" v-bind:can-expand="false" v-bind:expanded-view="true")
  
  .dashboard(transition-duration="0.3s" item-selector=".dashboard--item" gutter=".gutter-block-selector")&attributes({'v-masonry': 'true'})
    .gutter-block-selector
    .dashboard--item(v-for="(panel, index) in panels" v-bind:key="index" v-if="isVisible(panel)")&attributes({'v-masonry-tile': 'true'})
      component(v-bind:is="panel.component" v-bind:style="panelStyle(index)" v-bind:label="panel.label" v-bind:role="panel.role" v-bind:panel="panel" v-bind:classes="classes" v-bind:limitHeight="true" v-bind:can-expand="true")

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import _each from 'lodash/each';
import _filter from 'lodash/filter';
import _indexOf from 'lodash/indexOf';

// Mixins
import Auth from '@/mixins/Auth';
import PageStyle from '@/mixins/PageStyle';

// Components
import PageHeader from '@/components/PageHeader'
import ProfileClassSelector from '@/components/profile/ProfileClassSelector';

// Panels
import User from '@/components/profile/panels/User';
import Students from '@/components/profile/panels/Students';
import Submissions from '@/components/profile/panels/Submissions';
import Messages from '@/components/profile/panels/Messages';
import QuestionResponses from '@/components/profile/panels/QuestionResponses';
import Storify from '@/components/profile/panels/Storify';

export default {
  name: 'profile-main',
  mixins: [ Auth, PageStyle ],
  components: {
    PageHeader,
    ProfileClassSelector,
    User,
    Students,
    Submissions,
    Messages,
    QuestionResponses,
    Storify,
  },
  mounted() {
    this.ensureAuthenticated();
    
    // this.user.roles = ['user'];
    // this.user.roles = ['user', 'teacher'];
    // this.user.roles = ['user', 'teacher', 'admin'];

    setInterval(() => {
      this.$redrawVueMasonry();
    }, 2000);
  },
  data() {
    return {
      classes: [],
      pageStyle: { type: 'profile', minimized: true },
      contentPanelVisible: false,
      panelMargin: 10,
      panelWidth: 340,
      panels: [
        {
          role: 'user',
          label: 'Profile',
          component: 'user',
        },
        {
          role: 'user',
          label: 'Your Notes',
          component: 'messages',
        },
        {
          role: 'user',
          label: 'Your Homework',
          component: 'submissions',
        },
        {
          role: 'teacher',
          label: 'Class Notes',
          component: 'messages',
        },
        {
          role: 'teacher',
          label: 'Class Homework',
          component: 'submissions',
        },
        {
          role: 'teacher',
          label: 'Class Storify',
          component: 'storify',
        },
        {
          role: 'teacher',
          label: 'Class Students',
          component: 'students',
        },
        {
          role: 'admin',
          label: 'Registration Responses',
          component: 'question-responses',
        },
        {
          role: 'admin',
          label: 'All Notes',
          component: 'messages',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['user', 'profileAction', 'profileClass']),
    panelCount() {
      return _filter(this.panels, { visible: true }).length;
    },
  },
  methods: {
    isVisible(panel) {
      if (!this.user) return false;
      return (_indexOf(this.user.roles, panel.role) >= 0);
    },
    panelStyle(index) {
      return {
        width: `${this.panelWidth - this.panelMargin}px`
      };
    },
    togglePanel(panel) {
      panel.visible = !panel.visible
    },
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'

$action-expanded-max-width = 500px

.profile-page
  padding-top $navigation-height

// Profile action
.profile-action
  pinned()
  radius(4px)
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
  padding 20px
  padding-top $page-header-height + 20px
  .gutter-block-selector
    width 20px
  .dashboard--item
    radius(6px)
    background-color white
    margin-bottom 20px
    overflow hidden
    h1
      reset()
</style>
