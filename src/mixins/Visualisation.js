export default {
  methods: {
    loadVisualisation(visualisation) {
        if (!this.currentSection) { return false; }

        const segmentHeight = 158.0;
        const handleOffset = (segmentHeight / 4.0);
        const width = 200.0;
        const parentOffsetTop = (segmentHeight / 2.0);

        let points = '';

        let chunkedVis = _.chunk(_.values(visualisation), 5);

        chunkedVis = _.map(chunkedVis, (val) => _.mean(val));

        _.forEach(chunkedVis, function(value, index) {
          const offsetTop = (index * segmentHeight) + parentOffsetTop;
          points += `S ${value * width} ${offsetTop - handleOffset}, ${value * width} ${offsetTop} `;
        });

        this.points = `M0 0 ${points} L 0 ${(_.size(chunkedVis) * segmentHeight)} Z`;
    }
  },
}
