<template lang="pug">

  .like-indicator(@click="toggleLike")
    .heart(v-bind:class="{ active: haveliked }")
    .like-count(v-if="likes > 0") {{ likes }}

</template>

<script>
import API from '@/api';
import { mapGetters } from 'vuex';

// import reduce from 'lodash/reduce';

export default {
  name: 'like-indicator',
  props: ['contentSlug', 'classSlug', 'haveliked', 'likes'],
  mounted() {
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
      this.$store.commit('SHOW_AUTH');
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
      this.$store.commit('SHOW_LIKE_MODAL');
    },
    hideModal() {
      this.getLikeCount();
      this.$store.commit('DISMISS_LIKE_MODAL');
    },
    getLikeCount() {
      const request = { class: this.classSlug, content: this.contentSlug };
      API.course.getLikeCount(
        request,
        (response) => {
          this.$log.info(`123Response from like count request - '${this.contentSlug}'`);
          this.$log.info(response);
          // this.likeCount = reduce(response, function(sum, o) {
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

.like-indicator
  font-size 1em
  overflow hidden
  position absolute
  top 0
  right 0
  height 50px
  width 80px
  .heart
    height 50px
    width 50px
    padding 0
    position absolute
    top 0
    right 0
  .like-count
    color $color-text-grey
    font-size 0.9em
    position absolute
    line-height 50px
    top 1px
    right 40px
    text-align right
    

.heart {
  width: 50px;
  height: 50px;
  position: absolute;
  opacity 0.5
  background: url(../assets/icons/heart.png) no-repeat;
  background-position: 0 0;
  background-size: auto 50px;
  cursor: pointer;
}
.heart.active {
  background-position: -1400px 0;
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
    background-position: -1400px 0;
  }
}
</style>
