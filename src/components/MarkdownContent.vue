<template lang="pug">

div
  //- pre {{ markdown }}
  .rendered-markdown(v-html="renderedMarkdown")

</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import { mapGetters } from 'vuex';

import MarkdownIt from 'markdown-it';
import MarkdownItReplaceLink from 'markdown-it-replace-link';
import MarkdownItVideo from 'markdown-it-video';
import MarkdownItFrontMatter from 'markdown-it-front-matter';
import MarkdownItCustomBlock from 'markdown-it-custom-block';

import API from '@/api';
import * as types from '@/store/mutation-types';

export default {
  name: 'markdown-content',
  props: ['markdown'],
  computed: {
    ...mapGetters([
      'course'
    ]),
    renderedMarkdown() {

      const md = new MarkdownIt()
        .use(MarkdownItCustomBlock, {

          testexample(arg) {
            return `<h1>${arg}</h1>`
          },

          bio(arg) {
            if (!arg) { return 'loading...'; }

            const parts = arg.split('|');

            const caption = parts[0].trim();
            const image = parts[1].trim();

            if (parts.length > 2) {
              const bio = parts[2].trim();
              const link = parts[3].trim();

              return `
              <div class="md-bio md-bio--with-bio">
                <img class="md-bio--image" src="${image}" />
                <div class="md-bio--content">
                  <h5 class="md-bio--caption">${caption}</h5>
                  <p class="md-bio--bio">${bio}</p>
                  <a href="${link}" target="_blank" class="md-bio--link">${link}</a>
                </div>
              </div>
              `;

            } else {

              return `
              <div class="md-bio">
                <img class="md-bio--image" src="${image}" />
                <h5 class="md-bio--caption">${caption}</h5>
              </div>
              `;

            }
          },
      });

      return md.render(this.markdown.replace("@","\n\n@"));
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.rendered-markdown
  h1
    reset()
    color $color-text-dark-grey
    margin-bottom 5px
  h1, h2, h3, h4, h5, p, a, li
    color $color-text-dark-grey

</style>
