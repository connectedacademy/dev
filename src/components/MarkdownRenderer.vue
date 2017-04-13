<template lang="pug">

  .col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")

    .container

      .markdown-nav
        .pure-button.pure-button-primary(@click="back") Back
        .pure-button.pure-button-primary(v-if="loading") Loading
        a.pure-button.pure-button-primary.pull-right(:href="url" target="_blank") Open
        .pure-button.pure-button-primary.pull-right(@click="toggleColumnState") Toggle

      .rendered-markdown(v-html="result")

</template>

<script>
import _ from 'lodash';
import MarkdownIt from 'markdown-it';
import MarkdownItReplaceLink from 'markdown-it-replace-link';
import MarkdownItVideo from 'markdown-it-video';

import API from '../api';

export default {
  name: 'markdown-renderer',
  created() {
    this.$store.dispatch('setColumnState', 'narrow');
    this.loadMarkdown();
  },
  mounted() {
    this.$nextTick(() => { window.addEventListener('hashchange', this.loadMarkdown); });
  },
  methods: {
    toggleColumnState() {
      this.$store.dispatch('toggleColumnState');
    },
    back() { this.$router.go(-1); },
    loadMarkdown() {
      // Load markdown
      this.loading = true;
      API.markdown.fetchMarkdown(
        this.url,
        (response) => {
          this.renderedMarkdown = response;
          this.loading = false;
        },
        (response) => {
          this.renderedMarkdown = 'Loading...';
        },
      );
    },
  },
  computed: {
    result() {
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        replaceLink: (link, env) => {
          if (_.startsWith(link, 'http')) { return link; }
          if (_.endsWith(link, '.md')) {
            const currentUrl = this.url.substring(0, this.url.lastIndexOf('/') + 1);
            return `#${currentUrl}${link}`;
          }
          return `${this.$store.getters.course.baseUri}${this.$config.lang}${link}`;
        },
      })
      .use(MarkdownItReplaceLink)
      .use(MarkdownItVideo, {
        youtube: { width: 640, height: 390 },
        vimeo: { width: 500, height: 281 },
      });

      return md.render(this.renderedMarkdown);
    },
    url() {
      const content = (this.$route.hash) ? this.$route.hash : this.$route.query.url;
      if (_.startsWith(content, 'http')) { return content; }
      if (_.startsWith(content, '#')) { return _.replace(content, '#', ''); }
      return `${this.$store.getters.course.baseUri}${this.$config.lang}${content}`;
    },
  },
  data() {
    return {
      loading: true,
      renderedMarkdown: 'Loading...',
    };
  },
};
</script>

<style lang="stylus">

  @import "../assets/stylus/shared/*"
  @import "../assets/stylus/layout/page"

  .markdown-nav
    border-bottom alpha(white, 0.2) 1px solid
    margin-bottom 20px
    padding-bottom 20px
    .pure-button
      margin 0 5px
    a
      color white

  .rendered-markdown
    h1, h2, h3, h4, h5, p, a, li
      nomargin()
      nopadding()
      color white
      margin-bottom 5px
    img
      max-width 100%

</style>
