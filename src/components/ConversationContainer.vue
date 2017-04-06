<template lang="pug">

  .conversation-container

    .msg.visible(v-for="msg in msgs()" v-bind:style="{ top: msg.position + 'px' }")

      p {{ msg.username }}

      p {{ ' ' + msg.text }}

</template>

<script>
import _ from 'lodash';

export default {
  name: 'conversation-container',
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      scrollPosition: 0,
      msgs() {
        const msgHeight = 90;
        let i = 0;
        let msgs = [];
        while (i < 10) {
          msgs.push({
            username: '@username',
            text: `Test msg ${Math.ceil(this.scrollPosition * i)} #hashtag`,
            position: 0, // + ((i - 5) * 40) + (this.scrollPosition * 100),
          });
          i += 1;
        }
        const minAllowable = (msgs.length < 20) ? msgs.length : 20;
        msgs = msgs.slice(msgs.length - minAllowable, msgs.length);
        return msgs;
      },
    };
  },
};
</script>

<style lang="stylus" scoped>

@import "../assets/stylus/shared/*"

.conversation-container
  padding 0
  width 50%
  .msg
    border-left $color-primary 2px solid
    margin 15px 0
    padding 5px 10px

    position relative

    opacity 0

    transition opacity 1s
    p
      nomargin()
      nopadding()
      color white
    &.visible
      opacity 1

</style>
