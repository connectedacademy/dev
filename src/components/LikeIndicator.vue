<template lang="pug">

  .like-indicator
    span(@click="toggleLike")
      .heart(v-bind:class="{ active: hasLiked }")
      //- span {{ likeCount }}

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'like-indicator',
  props: ['content'],
  created() {
    this.getLikeCount();
  },
  data() {
    return {
      count: 0,
      hasLiked: false,
      hasLikedBefore: true,
    };
  },
  computed: {
    likeCount() {
      return `${this.count}`;
    },
  },
  methods: {
    toggleLike() {
       if (!this.hasLikedBefore) {
         this.showModal();
         return;
       }

       this.hasLiked = !this.hasLiked;
      //  alert(`Liking content - ${JSON.stringify(this.content)}`);
    },
    showModal() {
      this.$store.commit(types.SHOW_LIKE);
    },
    hideModal() {
      this.getLikeCount();
      this.$store.commit(types.DISMISS_LIKE);
    },
    getLikeCount() {
      const request = { class: this.$store.getters.currentClass.slug, content: this.content.slug };
      API.course.getLikeCount(
        request,
        (response) => {
          this.$log.info(`Response from like count request - '${this.content.slug}'`);
          this.$log.info(response);
          this.count = _.reduce(response, function(sum, o) {
            return o;
          });
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info(`Failed to retrieve like count for '${this.content.slug}'`);
          this.count = '-';
        },
      );
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.like-indicator
  radius(6px)
  font-size 1em
  position absolute
  top 25px
  right 5px
  padding 0 8px
  min-width 20px
  text-align right

.heart {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 50%;
  top: 50%;
  opacity 0.5
  transform: translate(-50%, -50%) scale(0.5);
  background: url(../assets/icons/heart.png) no-repeat;
  background-position: 0 0;
  background-size: auto 100px;
  cursor: pointer;
  animation: opacity 0.3s, fave-heart 1s steps(28);
}
.heart.active {
  background-position: -2800px 0;
  transition: background 1s steps(28);
  opacity 1.0
}
.heart:hover {
  opacity 1.0
}
@keyframes fave-heart {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -2800px 0;
  }
}
</style>
