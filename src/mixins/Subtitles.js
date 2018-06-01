import Vue from 'vue';
import API from '@/api';
import { mapGetters } from 'vuex';
import math from 'lodash/math';

export default {
  data() {
    return {
      subtitles: [],
    };
  },
  computed: {
    ...mapGetters(['course', 'currentClass']),
  },
  methods: {
    loadSubtitles(content) {
      if (typeof content.transcript === 'undefined') return
      
      Vue.$log.info('Getting subtitles...');

      this.subtitles = []; // Clear existing subtitles

      API.message.getSubtitles(
        {
          theClass: this.currentClass.slug,
          filename: content.transcript
        },
        response => {

          for (var subtitle of response) {

            let group = math.divide(math.floor(subtitle.start + 2.5), 5);

            const segmentGroup = parseInt(group);

            let newSubtitle = subtitle;

            newSubtitle.segmentGroup = segmentGroup;

            Vue.set(this.subtitles, segmentGroup, (this.subtitles[segmentGroup]) ? this.subtitles[segmentGroup] + ' ' + newSubtitle.text : newSubtitle.text);
          }
        },
        response => {},
      );
    }
  },
}
