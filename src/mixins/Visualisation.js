import Vue from 'vue';
import API from '@/api';
import { mapGetters } from 'vuex';

import _map from 'lodash/map';
import _take from 'lodash/take';
import values from 'lodash/values';
import _forEach from 'lodash/forEach';

import size from 'lodash/size';
import mean from 'lodash/mean';
import chunk from 'lodash/chunk';

export default {
  mounted() {
    this.loadVisualisation();
  },
  data() {
    return {
      points: '',
    };
  },
  computed: {
    ...mapGetters([
      'currentClass', 'currentSection',
    ]),
  },
  methods: {
    loadVisualisation() {

      const request = { class: this.currentClass.slug, content: this.content.slug };

      API.visualisation.getVisualisation(
        request,
        (response) => {

          const visualisation = response.data;

          const visHeight = 30.0;
          const width = 506.0;

          const handleOffset = (visHeight / 4.0);
          const parentOffsetTop = (visHeight / 2.0);

          this.points = '';

          let chunkedVis = visualisation;

          _forEach(chunkedVis, (index, value) => {
            if ((index > 0.1) && (index < 0.9)) {
              const offsetTop = (parseFloat(index) * visHeight) + parentOffsetTop;
              this.points += `S ${parseFloat(value) * -width} ${offsetTop - handleOffset}, ${parseFloat(value) * -width} ${offsetTop} `;
            }
          });

          this.points = `M0 0 ${this.points} L ${width} 0 Z`;

          console.log(`points ${this.points}`);
        },
        response => (response) => {
          this.points = '';
        },
      );
    },
    loadVisualisationLegacy(content) {

      const request = { class: this.currentClass.slug, content: this.content.slug };

      API.visualisation.getVisualisation(
        request,
        (response) => {

          const visualisation = response.data;

          const segmentHeight = this.$app.segmentHeight;
          const handleOffset = (segmentHeight / 4.0);
          const width = 200.0;
          const parentOffsetTop = (segmentHeight / 2.0);

          this.points = '';

          let chunkedVis = chunk(values(visualisation), 5);

          chunkedVis = _map(chunkedVis, (val) => mean(val));

          _forEach(chunkedVis, (value, index) => {
            const offsetTop = (index * segmentHeight) + parentOffsetTop;
            this.points += `S ${value * width} ${offsetTop - handleOffset}, ${value * width} ${offsetTop} `;
          });

          this.points = `M0 0 ${this.points} L 0 ${(size(chunkedVis) * segmentHeight)} Z`;
        },
        response => (response) => {
          this.points = '';
        },
      );


    }
  },
}
