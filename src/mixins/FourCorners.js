export default {
  methods: {
    loadFourCornersScript() {
      (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = function(){
          // Manually fire document load event to trigger fourcorner wrap
          window.FourCorners.init();
        };
        script.src = 'https://cdn.fourcorners.io/dist/4c.js';
        d.getElementsByTagName('head')[0].appendChild(script);
      }(document));
    },
  },
};
