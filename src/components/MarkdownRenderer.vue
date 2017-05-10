<template lang="pug">

.markdown-wrapper
  .content-block.white-block(v-if="frontMatterVisible")
    pre {{ frontMatter }}
  .rendered-markdown(v-html="result")

</template>

<script>
import _ from 'lodash';

import MarkdownIt from 'markdown-it';
import MarkdownItReplaceLink from 'markdown-it-replace-link';
import MarkdownItVideo from 'markdown-it-video';
import MarkdownItFrontMatter from 'markdown-it-front-matter';

import API from '@/api';

export default {
  name: 'markdown-renderer',
  created() {
    this.loadMarkdown();
  },
  mounted() {
    this.$nextTick(() => { window.addEventListener('hashchange', this.loadMarkdown); });
  },
  props: ['markdownUrl', 'frontMatterVisible'],
  methods: {
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
          return `${this.$store.getters.course.baseUri}${link}`;
        },
      })
      .use(MarkdownItReplaceLink)
      .use(MarkdownItVideo, {
        youtube: { width: 640, height: 390 },
        vimeo: { width: 500, height: 281 },
      })
      .use(MarkdownItFrontMatter, (fm) => {
        this.frontMatter = fm;
      });

      return md.render(this.renderedMarkdown);
    },
    url() {
      if (this.markdownUrl) {
        return this.markdownUrl;
      }
      const content = (this.$route.hash) ? this.$route.hash : this.$route.query.url;
      if (_.startsWith(content, 'http')) { return content; }
      if (_.startsWith(content, '#')) { return _.replace(content, '#', ''); }
      return `${this.$store.getters.course.baseUri}${this.$store.getters.currentClass.dir}/${content}`;
    },
  },
  data() {
    return {
      loading: true,
      renderedMarkdown: 'Loading...',
      frontMatter: {},
    };
  },
};
</script>

<style lang="stylus">

@import '../assets/stylus/shared/*'
@import '../assets/stylus/layout/page'

.rendered-markdown
  h1
    nomargin()
    nopadding()
    color $color-text-dark-grey
    margin-bottom 5px
  h1, h2, h3, h4, h5, p, a, li
    color $color-text-dark-grey
  img
    max-width 100%

</style>
