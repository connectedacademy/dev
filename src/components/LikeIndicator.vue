<template lang="pug">

  .like-indicator.animated.fadeIn
    .like-indicator-wrapper(@click="toggleLike")
      .heart(v-bind:class="{ active: haveliked }")
      .like-count(v-if="likeCount > 0") {{ likeCount }}

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

export default {
  name: 'like-indicator',
  props: ['contentSlug', 'classSlug', 'haveliked', 'likes'],
  created() {
    this.hasLiked = this.haveliked;
    this.likeCount = this.likes;
  },
  data() {
    return {
      firstTime: false,
      hasLiked: false,
      likeCount: 0,
    };
  },
  computed: {
    ...mapGetters(['isRegistered'])
  },
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
    toggleLike() {
      if (this.firstTime) {
        this.showModal();
        return;
      }

      if (!this.isRegistered) {
        this.showAuth();
        return;
      }

      const request = { class: this.classSlug, content: this.contentSlug };

      if (this.haveliked) {
        API.like.unlikeContent(
          request,
          (response) => {
            this.$log.info(`Response from unlike request - '${this.contentSlug}'`);
            this.$log.info(response);
            this.likeCount = this.likeCount - 1;
            this.$emit('update:hasLiked', false);
            this.$emit('update:likeCount', this.likeCount);
          },
          (response) => {
            // TODO: Handle failed request
            this.$log.info(`Failed to unlike content - '${this.contentSlug}'`);
          },
        )
      } else {
        API.like.likeContent(
          request,
          (response) => {
            this.$log.info(`Response from like request - '${this.contentSlug}'`);
            this.$log.info(response);
            this.likeCount = this.likeCount + 1;
            this.$emit('update:hasLiked', true);
            this.$emit('update:likeCount', this.likeCount);
          },
          (response) => {
            // TODO: Handle failed request
            this.$log.info(`Failed to like content - '${this.contentSlug}'`);
          },
        )
      }
    },
    showModal() {
      this.$store.commit(types.SHOW_LIKE);
    },
    hideModal() {
      this.getLikeCount();
      this.$store.commit(types.DISMISS_LIKE);
    },
    getLikeCount() {
      const request = { class: this.classSlug, content: this.contentSlug };
      API.course.getLikeCount(
        request,
        (response) => {
          this.$log.info(`123Response from like count request - '${this.contentSlug}'`);
          this.$log.info(response);
          // this.likeCount = _.reduce(response, function(sum, o) {
          //   return o;
          // });
          // this.$emit('update:likeCount', this.likeCount);
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.info(`Failed to retrieve like count for '${this.contentSlug}'`);
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
  top 0
  right 0
  .like-indicator-wrapper
    height 50px
    width 50px
    position relative
    .heart
      padding 0 8px
    .like-count
      color $color-text-grey
      font-size 0.9em
      position absolute
      line-height 50px
      top 1px
      left 0px
    

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
