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
    loadSubtitles() {
      Vue.log.log('Getting subtitles...');

      this.subtitles = []; // Clear existing subtitles

      API.message.getSubtitles(
        `${this.currentSection.slug}`,
        `${this.course.baseUri}${this.currentClass.dir}/${this.currentSection.transcript}`,
        response => {

          for (var subtitle of response.response) {

            let group = _.divide(_.floor(_.multiply(subtitle.start, 2), -1), 2);

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
