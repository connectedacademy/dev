<template lang="pug">

.admin-page
  .admin-panels.animated.fadeIn(ref="panels")

    .admin-panel.no-padding(v-if="visiblePanels[0]" v-bind:style="panelStyles[0]")

      .admin-panel--content
        a#prose-editor-link(v-bind:href="proseLink" target="_blank")
          img.icon(src="../../assets/icons/prose.svg")
          | Prose content editor
          icon(name="angle-right")

        ul.panel-selector
          li.panel-selector--item(v-bind:class="{'active': visiblePanels.CourseStudents}" @click="togglePanel(1)")
            | Students on course
            .toggle(v-bind:class="{active: visiblePanels[1]}")
          li.panel-selector--item(v-bind:class="{'active': visiblePanels[2]}" @click="togglePanel(2)")
            | Student submissions
            .toggle(v-bind:class="{active: visiblePanels[2]}")
          li.panel-selector--item(v-bind:class="{'active': visiblePanels[3]}" @click="togglePanel(3)")
            | Question responses
            .toggle(v-bind:class="{active: visiblePanels[3]}")
          li.panel-selector--item(v-bind:class="{'active': visiblePanels[4]}" @click="togglePanel(4)")
            | Students in class
            .toggle(v-bind:class="{active: visiblePanels[4]}")

    transition(name="fade-out" mode="out-in")
      course-students(v-if="visiblePanels[1]" v-bind:style="panelStyles[1]")
    transition(name="fade-out" mode="out-in")
      student-submissions(v-if="visiblePanels[2]" v-bind:style="panelStyles[2]")
    transition(name="fade-out" mode="out-in")
      question-responses(v-if="visiblePanels[3]" v-bind:style="panelStyles[3]")
    transition(name="fade-out" mode="out-in")
      class-students(v-if="visiblePanels[4]" v-bind:style="panelStyles[4]")

</template>

<script>
import * as types from '@/store/mutation-types';

import CourseStudents from '@/components/admin/panels/CourseStudents';
import ClassStudents from '@/components/admin/panels/ClassStudents';
import StudentSubmissions from '@/components/admin/panels/StudentSubmissions';
import QuestionResponses from '@/components/admin/panels/QuestionResponses';

export default {
  name: 'admin-main',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(types.SET_NAV_STATE, { minimized: true });
      vm.$store.commit(types.SET_PAGE_STYLE, 'admin');
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit(types.SET_NAV_STATE, { minimized: false });
    this.$store.commit(types.SET_PAGE_STYLE, undefined);
    next();
  },
  mounted() {
    this.layout();
  },
  data() {
    return {
      panelMargin: 0,
      panelWidth: 340,
      visiblePanels: [ true, true, true, true, true ],
      panelStyles: [
        { left: 0, width: 0 },
        { left: 0, width: 0 },
        { left: 0, width: 0 },
        { left: 0, width: 0 },
        { left: 0, width: 0 },
      ],
    };
  },
  computed: {
    proseLink() {
      return 'http://prose.io/#connectedacademy';
    },
  },
  methods: {
    togglePanel(index) {
      this.visiblePanels.splice(index, 1, !this.visiblePanels[index]);
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

</style>
