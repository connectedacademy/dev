webpackJsonp([17],{448:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=o(320),a=o.n(i);t.default={name:"video-embed",props:["contentType","videoSrc"],data:function(){return{theSrc:void 0}},computed:{src:function(){switch(this.contentType){case"webinar":return a()(this.videoSrc,"http")?this.videoSrc:"https://www.youtube.com/embed/"+this.videoSrc;default:return"https://www.youtube.com/embed/"+this.videoSrc}}},methods:{loadEmbed:function(){this.theSrc=this.src}}}},458:function(e,t,o){t=e.exports=o(288)(),t.push([e.i,".video-wrapper .loading-wrapper[data-v-22d732ae]{margin-bottom:20px;padding:58px 20px;text-align:center}.video-wrapper .video-container[data-v-22d732ae]{margin-bottom:20px;position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%}.video-wrapper .video-container embed[data-v-22d732ae],.video-wrapper .video-container iframe[data-v-22d732ae],.video-wrapper .video-container object[data-v-22d732ae]{position:absolute;top:0;left:0;width:100%;height:100%}","",{version:3,sources:["/root/connectedacademy/src/components/VideoEmbed.vue"],names:[],mappings:"AACA,iDACE,mBAAoB,AACpB,kBAAmB,AACnB,iBAAmB,CACpB,AACD,iDACE,mBAAoB,AACpB,kBAAmB,AACnB,sBAAuB,AACvB,SAAU,AACV,gBAAiB,AACjB,cAAgB,CACjB,AACD,uKAGE,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,WAAY,AACZ,WAAa,CACd",file:"VideoEmbed.vue",sourcesContent:["\n.video-wrapper .loading-wrapper[data-v-22d732ae] {\n  margin-bottom: 20px;\n  padding: 58px 20px;\n  text-align: center;\n}\n.video-wrapper .video-container[data-v-22d732ae] {\n  margin-bottom: 20px;\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n  max-width: 100%;\n}\n.video-wrapper .video-container iframe[data-v-22d732ae],\n.video-wrapper .video-container object[data-v-22d732ae],\n.video-wrapper .video-container embed[data-v-22d732ae] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}"],sourceRoot:""}])},480:function(e,t,o){var i=o(458);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);o(289)("17c7f754",i,!0)},518:function(e,t,o){o(480);var i=o(9)(o(448),o(522),"data-v-22d732ae",null);e.exports=i.exports},522:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"video-wrapper"},[e.theSrc?e._e():o("div",{staticClass:"loading-wrapper"},[o("div",{staticClass:"pure-button pure-button-youtube",on:{click:e.loadEmbed}},[e._v("Click to Load")])]),e.theSrc?o("div",{staticClass:"video-container"},[o("iframe",{attrs:{src:e.theSrc,frameborder:"0",allowfullscreen:"allowfullscreen"}})]):e._e()])},staticRenderFns:[]}}});