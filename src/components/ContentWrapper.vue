<template lang="pug">

  .content-wrapper
    pre-content
    class-content
    post-class-content
    webinar-content
    post-webinar-content

</template>

<script>
import PreContent from './content/PreContent';
import ClassContent from './content/ClassContent';
import PostClassContent from './content/PostClassContent';
import WebinarContent from './content/WebinarContent';
import PostWebinarContent from './content/PostWebinarContent';

export default {
  name: 'content-wrapper',
  components: {
    PreContent,
    ClassContent,
    PostClassContent,
    WebinarContent,
    PostWebinarContent,
  },
};
</script>

<style lang="stylus" scoped>

</style>
