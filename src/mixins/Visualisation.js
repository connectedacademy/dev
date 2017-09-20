import API from '@/api';
import values from 'lodash/values';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import size from 'lodash/size';
import mean from 'lodash/mean';
import { mapGetters } from 'vuex';

import chunk from 'lodash/chunk';

export default {
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
    loadVisualisation(content) {

      const request = { class: this.currentClass.slug, content: this.content.slug };

      API.visualisation.getVisualisation(
        request,
        (response) => {
          const visualisation = response.data;
          
          const segmentHeight = 158.0;
          const handleOffset = (segmentHeight / 4.0);
          const width = 200.0;
          const parentOffsetTop = (segmentHeight / 2.0);

          this.points = '';

          let chunkedVis = chunk(values(visualisation), 5);

          chunkedVis = map(chunkedVis, (val) => mean(val));

          forEach(chunkedVis, (value, index) => {
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
