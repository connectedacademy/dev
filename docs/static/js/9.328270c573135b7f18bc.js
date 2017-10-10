webpackJsonp([9],{683:function(n,a,e){e(715);var o=e(0)(e(708),e(722),"data-v-22d732ae",null);n.exports=o.exports},708:function(n,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var o=e(184),t=e.n(o);a.default={name:"video-embed",props:["contentType","videoSrc","autoLoad"],mounted:function(){var n=this;this.autoLoad&&setTimeout(function(){n.theSrc=n.src},1e3)},data:function(){return{theSrc:void 0}},computed:{src:function(){switch(this.contentType){case"webinar":return t()(this.videoSrc,"http")?this.videoSrc:"https://www.youtube.com/embed/"+this.videoSrc;default:return"https://www.youtube.com/embed/"+this.videoSrc}}},methods:{loadEmbed:function(){this.theSrc=this.src,this.$ga.event("video-embed","embed-loaded",this.src)}}}},712:function(n,a,e){a=n.exports=e(681)(),a.push([n.i,".hidden[data-v-22d732ae],[v-cloak][data-v-22d732ae]{display:none}.pull-left[data-v-22d732ae]{float:left}.pull-right[data-v-22d732ae]{float:right}.clearfix[data-v-22d732ae]{clear:both;float:none}.fa-icon[data-v-22d732ae]{width:auto;height:1em}.no-margin[data-v-22d732ae]{margin:0!important}.no-padding[data-v-22d732ae]{padding:0!important}.background-white[data-v-22d732ae]{background-color:#fff!important}.main-container[data-v-22d732ae]{border-radius:4px;position:relative}@media (max-width:800px){.main-container[data-v-22d732ae]{border-radius:0}}.main-container.main-container-padded[data-v-22d732ae]{padding:20px}.content-block[data-v-22d732ae]{border-radius:4px;padding:20px;margin:20px 0 0}@media (max-width:800px){.content-block[data-v-22d732ae]{border-radius:0}}.content-block.white-block[data-v-22d732ae]{background-color:#fff}.fade-enter-active[data-v-22d732ae],.fade-leave-active[data-v-22d732ae]{transition:all .3s ease}.fade-enter[data-v-22d732ae],.fade-leave-to[data-v-22d732ae]{opacity:0}.pure-button[data-v-22d732ae]{transition:all .3s ease;border-radius:4px;background-color:transparent;border:1px solid #29b474;color:#29b474;display:inline-block;font-family:inherit;font-size:100%;outline:0;padding:.5em 1em;text-align:center;text-decoration:none}.pure-button[data-v-22d732ae]:hover{background-color:#29b474;color:#fff;cursor:pointer}.pure-button.full-width[data-v-22d732ae]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-22d732ae]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-22d732ae]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-22d732ae]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-22d732ae]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-22d732ae]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-22d732ae]:hover{background-color:#25a268}.pure-button.pure-button-continue[data-v-22d732ae]{border-radius:25px;background-color:#29b474;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-continue[data-v-22d732ae]:hover{background-color:#25a268}.pure-button.pure-button-youtube[data-v-22d732ae]{border-radius:25px;background-color:#c4302b;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-youtube[data-v-22d732ae]:hover{background-color:#b02b27}.pure-button.pure-button-soundcloud[data-v-22d732ae]{border-radius:25px;background-color:#f70;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-soundcloud[data-v-22d732ae]:hover{background-color:#e66b00}.pure-button.pure-button-twitter[data-v-22d732ae]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-22d732ae]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-22d732ae]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-22d732ae]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-22d732ae]{border-color:transparent}.pure-button.pure-button-homework[data-v-22d732ae]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-22d732ae]:hover{background-color:#fd3c51;color:#fff}.video-wrapper .loading-wrapper[data-v-22d732ae]{background-color:#e9e9e9;margin-bottom:20px;padding:58px 20px;text-align:center}.video-wrapper .video-container[data-v-22d732ae]{margin-bottom:20px;position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%}.video-wrapper .video-container embed[data-v-22d732ae],.video-wrapper .video-container iframe[data-v-22d732ae],.video-wrapper .video-container object[data-v-22d732ae]{position:absolute;top:0;left:0;width:100%;height:100%}","",{version:3,sources:["/root/connectedacademy/src/components/VideoEmbed.vue"],names:[],mappings:"AA6DA,oDAEE,YAAc,CACf,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,yBACA,iCACI,eAAiB,CACpB,CACA,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,yBACA,gCACI,eAAiB,CACpB,CACA,AACD,4CACE,qBAAuB,CACxB,AACD,wEAEE,uBAA0B,CAC3B,AACD,6DAEE,SAAW,CACZ,AACD,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,6BAA8B,AAC9B,yBAA0B,AAC1B,cAAe,AACf,qBAAsB,AACtB,oBAAqB,AACrB,eAAgB,AAChB,UAAW,AACX,iBAAmB,AACnB,kBAAmB,AACnB,oBAAsB,CACvB,AACD,oCACE,yBAA0B,AAC1B,WAAY,AACZ,cAAgB,CACjB,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,mDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,yDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,qDACE,mBAAoB,AACpB,sBAAuB,AACvB,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,2DACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,iDACE,yBAA0B,AAC1B,mBAAoB,AACpB,kBAAmB,AACnB,iBAAmB,CACpB,AACD,iDACE,mBAAoB,AACpB,kBAAmB,AACnB,sBAAuB,AACvB,SAAU,AACV,gBAAiB,AACjB,cAAgB,CACjB,AACD,uKAGE,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,WAAY,AACZ,WAAa,CACd",file:"VideoEmbed.vue",sourcesContent:["\n.hidden[data-v-22d732ae],\n[v-cloak][data-v-22d732ae] {\n  display: none;\n}\n.pull-left[data-v-22d732ae] {\n  float: left;\n}\n.pull-right[data-v-22d732ae] {\n  float: right;\n}\n.clearfix[data-v-22d732ae] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-22d732ae] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-22d732ae] {\n  margin: 0 !important;\n}\n.no-padding[data-v-22d732ae] {\n  padding: 0 !important;\n}\n.background-white[data-v-22d732ae] {\n  background-color: #fff !important;\n}\n.main-container[data-v-22d732ae] {\n  border-radius: 4px;\n  position: relative;\n}\n@media (max-width: 800px) {\n.main-container[data-v-22d732ae] {\n    border-radius: 0;\n}\n}\n.main-container.main-container-padded[data-v-22d732ae] {\n  padding: 20px;\n}\n.content-block[data-v-22d732ae] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n@media (max-width: 800px) {\n.content-block[data-v-22d732ae] {\n    border-radius: 0;\n}\n}\n.content-block.white-block[data-v-22d732ae] {\n  background-color: #fff;\n}\n.fade-enter-active[data-v-22d732ae],\n.fade-leave-active[data-v-22d732ae] {\n  transition: all 0.3s ease;\n}\n.fade-enter[data-v-22d732ae],\n.fade-leave-to[data-v-22d732ae] {\n  opacity: 0;\n}\n.hidden[data-v-22d732ae],\n[v-cloak][data-v-22d732ae] {\n  display: none;\n}\n.pull-left[data-v-22d732ae] {\n  float: left;\n}\n.pull-right[data-v-22d732ae] {\n  float: right;\n}\n.clearfix[data-v-22d732ae] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-22d732ae] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-22d732ae] {\n  margin: 0 !important;\n}\n.no-padding[data-v-22d732ae] {\n  padding: 0 !important;\n}\n.background-white[data-v-22d732ae] {\n  background-color: #fff !important;\n}\n.main-container[data-v-22d732ae] {\n  border-radius: 4px;\n  position: relative;\n}\n@media (max-width: 800px) {\n.main-container[data-v-22d732ae] {\n    border-radius: 0;\n}\n}\n.main-container.main-container-padded[data-v-22d732ae] {\n  padding: 20px;\n}\n.content-block[data-v-22d732ae] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n@media (max-width: 800px) {\n.content-block[data-v-22d732ae] {\n    border-radius: 0;\n}\n}\n.content-block.white-block[data-v-22d732ae] {\n  background-color: #fff;\n}\n.fade-enter-active[data-v-22d732ae],\n.fade-leave-active[data-v-22d732ae] {\n  transition: all 0.3s ease;\n}\n.fade-enter[data-v-22d732ae],\n.fade-leave-to[data-v-22d732ae] {\n  opacity: 0;\n}\n.pure-button[data-v-22d732ae] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n  display: inline-block;\n  font-family: inherit;\n  font-size: 100%;\n  outline: 0;\n  padding: 0.5em 1em;\n  text-align: center;\n  text-decoration: none;\n}\n.pure-button[data-v-22d732ae]:hover {\n  background-color: #29b474;\n  color: #fff;\n  cursor: pointer;\n}\n.pure-button.full-width[data-v-22d732ae] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-22d732ae] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-22d732ae]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-22d732ae] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-22d732ae]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-22d732ae] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-22d732ae]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-continue[data-v-22d732ae] {\n  border-radius: 25px;\n  background-color: #29b474;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-continue[data-v-22d732ae]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-youtube[data-v-22d732ae] {\n  border-radius: 25px;\n  background-color: #c4302b;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-youtube[data-v-22d732ae]:hover {\n  background-color: #b02b27;\n}\n.pure-button.pure-button-soundcloud[data-v-22d732ae] {\n  border-radius: 25px;\n  background-color: #f70;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-soundcloud[data-v-22d732ae]:hover {\n  background-color: #e66b00;\n}\n.pure-button.pure-button-twitter[data-v-22d732ae] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-22d732ae]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-22d732ae] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-22d732ae]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-22d732ae] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-22d732ae] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-22d732ae]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\n.video-wrapper .loading-wrapper[data-v-22d732ae] {\n  background-color: #e9e9e9;\n  margin-bottom: 20px;\n  padding: 58px 20px;\n  text-align: center;\n}\n.video-wrapper .video-container[data-v-22d732ae] {\n  margin-bottom: 20px;\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n  max-width: 100%;\n}\n.video-wrapper .video-container iframe[data-v-22d732ae],\n.video-wrapper .video-container object[data-v-22d732ae],\n.video-wrapper .video-container embed[data-v-22d732ae] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}"],sourceRoot:""}])},715:function(n,a,e){var o=e(712);"string"==typeof o&&(o=[[n.i,o,""]]),o.locals&&(n.exports=o.locals);e(682)("17c7f754",o,!0)},722:function(n,a){n.exports={render:function(){var n=this,a=n.$createElement,e=n._self._c||a;return e("div",{staticClass:"video-wrapper"},[n.theSrc?n._e():e("div",{staticClass:"loading-wrapper"},[e("div",{staticClass:"pure-button pure-button-youtube",on:{click:n.loadEmbed}},[n._v("Click to Load")])]),n.theSrc?e("div",{staticClass:"video-container"},[e("iframe",{attrs:{src:n.theSrc,frameborder:"0",allowfullscreen:"allowfullscreen"}})]):n._e()])},staticRenderFns:[]}}});