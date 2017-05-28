import FourCorners from '@/fourcorners.js';

export default {
  mounted() {
    this.loadFourCornersScript();
  },
  methods: {
    loadFourCornersScript() {
      (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = function(){
          // Manually fire document load event to trigger fourcorner wrap
          var evt = document.createEvent('Event');
          evt.initEvent('load', false, false);
          window.dispatchEvent(evt);
        };
        script.src = 'https://digitalinteraction.github.io/fourcorners/dist/4c.js';
        d.getElementsByTagName('head')[0].appendChild(script);
      }(document));
    },
  },
};
