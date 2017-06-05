<template lang="pug">

  .like-indicator(@click="getLikeCount")
    icon.hidden(name="heart")
    | {{ likeCount }}

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';

export default {
  name: 'like-indicator',
  props: ['content'],
  created() {
    this.getLikeCount();
  },
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    likeCount() {
      return `${this.count} likes`;
    },
  },
  methods: {
    getLikeCount() {
      const request = { class: this.$store.getters.currentClass.slug, content: this.content.slug };
      API.course.getLikeCount(
        request,
        (response) => {
          this.$log.log(`Response from like count request - '${this.content.slug}'`);
          this.$log.log(response);
          this.count = _.reduce(response, function(sum, o) {
            return o;
          });
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.log(`Failed to retrieve like count for '${this.content.slug}'`);
          this.count = '-';
        },
      );
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '../assets/stylus/shared'

.like-indicator
  radius(6px)
  font-size 0.7em
  position absolute
  top 6px
  right 30px
  line-height 24px
  padding 0 8px
  min-width 20px
  text-align right

</style>
