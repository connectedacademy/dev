<template lang="pug">

	.main-page
		.col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" @scroll="onScroll")
			.stream
				video-container
				.msg-container
					.msg.visible.animated.fadeInUp(v-for="msg in msgs()" v-bind:style="{ top: msg.position + 'px' }")
						p
							strong {{ msg.username }}
						p {{ ' ' + msg.text }}

		message-composer(v-bind:scroll-position="scrollPosition")

</template>

<script>

  import MessageComposer from './MessageComposer';
  import VideoContainer from './VideoContainer';

  export default {
    name: 'main',
    created() {
      this.$store.commit('setColumnState', 'narrow');
    },
    data() {
      return {
        navTitle: 'Connected Academy - Main',
        scrollPosition: 0,
        msgs() {
          const msgHeight = 90;
          let i = 0;
          let msgs = [];
          while (i < 10) {
          // for (let i = 0; i < 500; i += 1) {
            msgs.push({ username: '@username', text: `Test msg ${Math.ceil(this.scrollPosition * i)} #hashtag`, position: 360 + ((i - 5) * 40) + (this.scrollPosition * 100) });
          // }
            i += 1;
          }
          const minAllowable = (msgs.length < 5) ? msgs.length : 5;
          msgs = msgs.slice(msgs.length - minAllowable, msgs.length);
          return msgs;
        },
      };
    },
    components: { MessageComposer, VideoContainer },
    methods: {
      onScroll() {
        this.scrollPosition = this.$refs.main.scrollTop / 100;
        this.scrollPosition = (this.scrollPosition < 0) ? 0 : this.scrollPosition;
      },
    },
  };
</script>

<style lang="stylus">

	@import "../assets/stylus/layout/page"

	.msg-container
		height 12000px
		padding 20px
		.msg
			/*background-color alpha(white, 1)*/
			border-radius 6px
			color $color-dark-grey
			margin-bottom 20px
			padding 10px 15px

			position absolute
			/*position relative*/
			left 20px
			right 20px

			opacity 0

			transition opacity 1s
			p
				nomargin()
				nopadding()
				color white
			&.visible
				opacity 1

</style>
