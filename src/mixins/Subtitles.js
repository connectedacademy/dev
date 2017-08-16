import Vue from 'vue';
import API from '@/api';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      subtitles: [],
    };
  },
  computed: {
    ...mapGetters(['course', 'currentClass', 'currentSection']),
  },
  methods: {
    loadSubtitles(content) {
      Vue.$log.info('Getting subtitles...');

      this.subtitles = []; // Clear existing subtitles

      API.message.getSubtitles(
        `${content.slug}`,
        `${this.course.baseUri}${this.currentClass.dir}/${content.transcript}`,
        response => {

          for (var subtitle of response.response) {

            let group = _.divide(_.floor(subtitle.start + 2.5), 5);

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
