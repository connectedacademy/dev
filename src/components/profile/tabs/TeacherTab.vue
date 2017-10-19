<template lang="pug">
#teacher-tab.profile-tab

  //- Class Selector
  profile-class-selector(v-bind:show-all="true" v-bind:classes.sync="classes")

  //- Classroom code
  .classroom-code-generator(v-if="profileClass")
    ul.class-codes(v-if="filteredClasses.length > 0")
      li(v-for="(generatedCode, index) in filteredClasses[0].codes")
        h3 {{ generatedCode.code }}
        p(v-if="generatedCode.teacher") {{ generatedCode.teacher.name }}
        p(v-else) Unknown
    h3 Generate class code
    .pure-button(@click="generateCode") Generate Code for '{{ profileClassSlug }}'

  //- Action Selector
  action-selector(userType="teacher")

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import _filter from 'lodash/filter';

import ProfileClassSelector from '@/components/profile/ProfileClassSelector';
import ActionSelector from '@/components/profile/ActionSelector';

export default {
  name: 'teacher-tab',
  components: {
    ProfileClassSelector,
    ActionSelector
  },
  data() {
    return {
      classes: [],
    };
  },
  computed: {
    ...mapGetters(['profileClass', 'profileClassSlug']),
    filteredClasses() {
      return _filter(this.classes, (o) => {
        return o.teacher.id === user.id;
      });
    }
  },
  methods: {
    generateCode() {
      
      API.classroom.getTeacherCode(
        this.profileClassSlug,
        (response) => {
          this.$log.info(response);
          this.classroomCode = response.code;
          this.studentsCount = response.students;
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info('Failed to retrieve teacher code');
        },
      );
    }
  }
}
</script>

<style lang="stylus" scoped>
  
@import '~stylus/profile'

.profile-tab
  padding 20px
  &#teacher-tab
    padding 20px

    .classroom-code-generator
      ul.class-codes
        cleanlist()
        li
          cleanlist()
          border $color-border 1px solid
          display inline-block
          margin 5px
          padding 10px 20px
          text-align center
          h3
            reset()
            color $color-text-dark-grey
          p
            reset()
            color $color-text-grey

</style>
