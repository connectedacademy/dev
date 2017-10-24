<template lang="pug">

.profile-page
  .profile-panels(ref="panels" v-if="!checkingAuthentication" v-bind:class="{ 'has-content': profileAction }")

    // - Filter Panel
    #primary-panel.profile-column.no-padding

      .profile-tab-bar
        ul.profile-tab-bar-items
          li(v-for="(tab, index) in tabs" v-bind:key="index" v-bind:class="{ active: (activeTabIndex === index), enabled: userHasRole(tab.role) }" @click="setTab(index)")
            | {{ tab.label }}
          .clearfix

      .profile-tabs
        component(v-bind:is="tabs[activeTabIndex].component" v-on:action="setprofileAction")

      // .profile-panel--content
        
        //- Storify Link
        a#storify-link(v-bind:href="storifyLink" target="_blank" v-if="isAdmin")
          img.icon(src="../../assets/icons/prose.svg")
          | Storify
          icon(name="angle-right")
        
        //- Prose Link
        a#prose-editor-link(v-bind:href="proseLink" target="_blank" v-if="isAdmin")
          img.icon(src="../../assets/icons/prose.svg")
          | Prose content editor
          icon(name="angle-right")

    //- Content Panel
    #content-panel.profile-column.no-padding(v-bind:class="{ visible: profileAction }")
      component(v-if="profileAction" v-bind:is="profileAction.action" v-bind:class-slug="activeClassSlug" v-bind:label="profileAction.label")
      //- transition(name="fade-out" mode="out-in" v-for="(panel, index) in panels" v-bind:key="index")
        component(v-bind:is="panel.component" v-if="panel.visible" v-bind:style="panelStyle(index)" v-bind:class-slug="activeClassSlug" v-bind:label="panel.label")

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import _filter from 'lodash/filter';
import _indexOf from 'lodash/indexOf';

// Mixins
import Auth from '@/mixins/Auth';
import PageStyle from '@/mixins/PageStyle';

// Tabs
import ProfileTab from '@/components/profile/tabs/ProfileTab';
import TeacherTab from '@/components/profile/tabs/TeacherTab';
import AdminTab from '@/components/profile/tabs/AdminTab';

// Panels
import Students from '@/components/profile/panels/Students';
import Submissions from '@/components/profile/panels/Submissions';
import Messages from '@/components/profile/panels/Messages';
import QuestionResponses from '@/components/profile/panels/QuestionResponses';
import Storify from '@/components/profile/panels/Storify';

import 'vue-awesome/icons/angle-right';

export default {
  name: 'profile-main',
  mixins: [ Auth, PageStyle ],
  components: {
    ProfileTab,
    TeacherTab,
    AdminTab,
    Students,
    Submissions,
    Messages,
    QuestionResponses,
    Storify,
  },
  mounted() {
    this.ensureAuthenticated();
  },
  data() {
    return {
      pageStyle: { type: 'admin', minimized: true },
      contentPanelVisible: false,
      activeClass: undefined,
      activeClassSlug: undefined,
      panelMargin: 10,
      panelWidth: 340,
      activeTabIndex: 0,
      tabs: [
        {
          label: 'Profile',
          identifier: 'profile',
          component: 'profile-tab',
          role: 'user',
        },
        {
          label: 'Teacher',
          identifier: 'teacher',
          component: 'teacher-tab',
          role: 'teacher',
        },
        {
          label: 'Admin',
          identifier: 'admin',
          component: 'admin-tab',
          role: 'admin',
        }
      ],
      panels: [
        {
          visible: true,
          label: 'Students',
          component: 'students',
        },
        {
          visible: false,
          label: 'Messages',
          component: 'messages',
        },
        {
          visible: false,
          label: 'Homework',
          component: 'submissions',
        }
      ],
    };
  },
  computed: {
    ...mapGetters(['user', 'profileAction', 'profileClass']),
    proseLink() {
      return 'http://prose.io/#connectedacademy';
    },
    storifyLink() {
      return 'https://storify.com';
    },
    panelCount() {
      return _filter(this.panels, { visible: true }).length;
    },
  },
  methods: {
    userHasRole(role) {
      return (_indexOf(this.user.roles, role) >= 0);
    },
    setprofileAction(action) {
      console.log(action);
      this.profileAction = action;
    },
    setTab(index) {
      this.activeTabIndex = index
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

.profile-page
  pinned()
  background-color $color-main-page
  top $navigation-height
  overflow-x none
  overflow-y scroll
  position fixed

a#prose-editor-link, a#storify-link
  animate()
  color white
  font-size 1.2em
  display block
  height 80px
  line-height 80px
  overflow hidden
  margin-bottom 20px
  padding 0 35px 0 70px
  position relative
  text-decoration none
  img.icon
    position absolute
    left 0
    top 0
    height 30px
    width 30px
    margin 25px 0px 25px 25px
  .fa-icon
    position absolute
    right 10px
    top 0
    height 80px
    width 15px
  &#prose-editor-link
    background-color $color-prose
    &:hover
      background-color lighten($color-prose, 10%)
  &#storify-link
    background-color $color-storify
    &:hover
      background-color lighten($color-storify, 10%)

// Transitions
.fade-out-enter-active, .fade-out-leave-active
  transition all 0.1s ease

.fade-out-enter, .fade-out-leave-to
  opacity 0

.fade-out-enter-to, .fade-out-leave
  opacity 1


.content-filter--selector
  select.full-width
    box-sizing()
    height 40px
    width 100%
    outline 0
</style>
