<template lang="pug">

.admin-page
  .admin-panels.animated.fadeIn(ref="panels")

    .admin-panel.no-padding(v-if="visiblePanels['0']" v-bind:style="panelStyles['0']")

      .admin-panel--content

        .content-filter--selector
          select.full-width(v-model="classSlug")
            option(v-for="(theClass, index) in classes" v-bind:value="theClass.slug" v-bind:key="index")
              | {{ theClass.title }}

        ul.panel-selector
          li.panel-selector--item(v-bind:class="{'active': visiblePanels['1']}" @click="togglePanel('1')")
            | Student submissions
            .toggle(v-bind:class="{active: visiblePanels['1']}")
          li.panel-selector--item(v-bind:class="{'active': visiblePanels['2']}" @click="togglePanel('2')")
            | Storify content
            .toggle(v-bind:class="{active: visiblePanels['2']}")
          li.panel-selector--item(v-bind:class="{'active': visiblePanels['3']}" @click="togglePanel('3')")
            | Students on course
            .toggle(v-bind:class="{active: visiblePanels['3']}")
          //- li.panel-selector--item(v-bind:class="{'active': visiblePanels['4']}" @click="togglePanel('4')")
            | Question responses
            .toggle(v-bind:class="{active: visiblePanels['4']}")
          //- li.panel-selector--item(v-bind:class="{'active': visiblePanels['5']}" @click="togglePanel('5')")
            | Students in class
            .toggle(v-bind:class="{active: visiblePanels['5']}")

        a#prose-editor-link(v-bind:href="proseLink" target="_blank" v-if="user && user.admin")
          img.icon(src="../../assets/icons/prose.svg")
          | Prose content editor
          icon(name="angle-right")

    transition(name="fade-out" mode="out-in")
      student-submissions(v-if="visiblePanels['1']" v-bind:style="panelStyles['1']" v-bind:class-slug="classSlug")
    transition(name="fade-out" mode="out-in")
      storify(v-if="visiblePanels['2']" v-bind:style="panelStyles['2']" v-bind:class-slug="classSlug")
    transition(name="fade-out" mode="out-in")
      course-students(v-if="visiblePanels['3']" v-bind:style="panelStyles['3']" v-bind:class-slug="classSlug")
    //- transition(name="fade-out" mode="out-in")
    //-   question-responses(v-if="visiblePanels['4']" v-bind:style="panelStyles['4']")
    //- transition(name="fade-out" mode="out-in")
    //-   class-students(v-if="visiblePanels['5']" v-bind:style="panelStyles['5']")

</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import CourseStudents from '@/components/admin/panels/CourseStudents';
import ClassStudents from '@/components/admin/panels/ClassStudents';
import StudentSubmissions from '@/components/admin/panels/StudentSubmissions';
import QuestionResponses from '@/components/admin/panels/QuestionResponses';
import Storify from '@/components/admin/panels/Storify';

import 'vue-awesome/icons/angle-right';

export default {
  name: 'admin-main',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit('SET_NAV_STATE', { minimized: true });
      vm.$store.commit('SET_PAGE_STYLE', 'admin');
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('SET_NAV_STATE', { minimized: false });
    this.$store.commit('SET_PAGE_STYLE', undefined);
    next();
  },
  mounted() {
    this.layout();
    if (this.course.classes) {
      this.classSlug = this.course.classes[0].slug;
    }
  },
  data() {
    return {
      panelMargin: 10,
      panelWidth: 340,
      visiblePanels: {
        0: true,
        1: true,
        2: true,
        3: true,
        4: false,
        5: false,
      },
      panelStyles: {
        0: { left: 0, width: 0 },
        1: { left: 0, width: 0 },
        2: { left: 0, width: 0 },
        3: { left: 0, width: 0 },
        4: { left: 0, width: 0 },
        5: { left: 0, width: 0 },
      },
      classSlug: undefined,
    };
  },
  computed: {
    ...mapGetters(['course', 'user']),
    proseLink() {
      return 'http://prose.io/#connectedacademy';
    },
    classes() {
      return this.course.classes;
    }
  },
  methods: {
    togglePanel(index) {
      Vue.set(this.visiblePanels, index, !this.visiblePanels[index]);
      this.layout();
    },
    layout() {

      let newLayout = [];
      let outerIndex = 0;

      for (var outerPanel in this.visiblePanels) {
        let offset = 0;
        let innerIndex = 0;

        for (var innerPanel in this.visiblePanels) {
          if ((innerIndex < outerIndex) && this.visiblePanels[innerPanel]) {
            offset = offset + (this.panelWidth + this.panelMargin);
          }
          innerIndex += 1;
        }

        newLayout.push({
          left: `${offset}px`,
          width: `${this.panelWidth}px`,
        });

        outerIndex += 1;
      }

      this.panelStyles = newLayout;
    },
  },
  components: {
    CourseStudents,
    ClassStudents,
    StudentSubmissions,
    QuestionResponses,
    Storify,
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/admin'

a#prose-editor-link
  animate()
  background-color $color-darkest-grey
  color white
  font-size 1.2em
  display block
  height 80px
  line-height 80px
  overflow hidden
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
  &:hover
    background-color lighten($color-darkest-grey, 10%)

ul.panel-selector
  cleanlist()
  border $color-border 1px solid
  margin 20px 0
  li.panel-selector--item
    cleanlist()
    background-color white
    border-bottom $color-border 1px solid
    padding 20px
    padding-right 30px
    position relative
    &:hover
      cursor pointer
      background-color $color-lightest-grey
    .toggle
      radius(50%)
      background-color $color-danger
      height 10px
      width 10px
      margin-top -(10px / 2)
      position absolute
      right 10px
      top 50%
      bottom 0
      &.active
        background-color $color-success
    &:last-child
      border-bottom none

// Transitions
.fade-out-enter-active, .fade-out-leave-active
  transition all 0.1s ease

.fade-out-enter, .fade-out-leave-to
  opacity 0
  transform scale(0.9,0.9)

.fade-out-enter-to, .fade-out-leave
  opacity 1
  transform scale(1.0,1.0)


.content-filter--selector
  select.full-width
    box-sizing()
    height 40px
    width 100%
    outline 0
</style>
