webpackJsonp([14],{297:function(n,o,t){t(722);var a=t(9)(t(629),t(874),"data-v-154896f1",null);n.exports=a.exports},629:function(n,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var a=t(28),A=t.n(a),e=t(4);o.default={name:"demo-modal",computed:A()({},t.i(e.b)(["demoModalVisible"])),methods:{closeModal:function(){this.$store.commit("DISMISS_DEMO_MODAL")}}}},666:function(n,o,t){o=n.exports=t(287)(),o.push([n.i,".pure-button[data-v-154896f1]{transition:all .3s ease;border-radius:4px;background-color:transparent;border:1px solid #29b474;color:#29b474;display:inline-block;font-family:inherit;font-size:100%;outline:0;padding:.5em 1em;text-align:center;text-decoration:none}.pure-button[data-v-154896f1]:hover{background-color:#29b474;color:#fff;cursor:pointer}.pure-button.full-width[data-v-154896f1]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-154896f1]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-154896f1]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-154896f1]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-154896f1]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-154896f1]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-154896f1]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-154896f1]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-154896f1]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-154896f1]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-154896f1]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-154896f1]{border-color:transparent}.pure-button.pure-button-homework[data-v-154896f1]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-154896f1]:hover{background-color:#fd3c51;color:#fff}body[data-v-154896f1],html[data-v-154896f1]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.hidden[data-v-154896f1]{display:none}.pull-left[data-v-154896f1]{float:left}.pull-right[data-v-154896f1]{float:right}.clearfix[data-v-154896f1]{clear:both;float:none}.fa-icon[data-v-154896f1]{width:auto;height:1em}.no-margin[data-v-154896f1]{margin:0!important}.no-padding[data-v-154896f1]{padding:0!important}.background-white[data-v-154896f1]{background-color:#fff!important}.text-white[data-v-154896f1]{color:#fff}.fade-enter-active[data-v-154896f1],.fade-leave-active[data-v-154896f1]{transition:opacity .2s}.fade-enter[data-v-154896f1],.fade-leave-to[data-v-154896f1]{opacity:0}.fade-enter-to[data-v-154896f1],.fade-leave[data-v-154896f1]{opacity:1}.main-container[data-v-154896f1]{border-radius:4px;position:relative}@media (max-width:800px){.main-container[data-v-154896f1]{border-radius:0}}.main-container.main-container-padded[data-v-154896f1]{padding:20px}.content-block[data-v-154896f1]{border-radius:4px;padding:20px;margin:20px 0 0}@media (max-width:800px){.content-block[data-v-154896f1]{border-radius:0}}.content-block.white-block[data-v-154896f1]{background-color:#fff}.icon-margin[data-v-154896f1]{margin:0 5px}#demo-modal[data-v-154896f1]{transition:all .3s ease;display:block;max-width:320px;position:fixed;z-index:57;top:120px;left:50%;margin-left:-160px;opacity:0;pointer-events:none}#demo-modal.visible[data-v-154896f1]{top:80px;opacity:1;pointer-events:all}#demo-modal #demo-modal--header[data-v-154896f1]{height:40px;line-height:40px;text-align:center}#demo-modal #demo-modal--header h1[data-v-154896f1]{margin:0;padding:0;color:#fff;font-size:1.2em}#demo-modal #demo-modal--container[data-v-154896f1]{border-radius:12px;background-color:#fff;padding:20px 30px;text-align:center}#demo-modal #demo-modal--container p[data-v-154896f1]{margin:0 0 20px}","",{version:3,sources:["/root/connectedacademy/src/components/modals/DemoModal.vue"],names:[],mappings:"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,6BAA8B,AAC9B,yBAA0B,AAC1B,cAAe,AACf,qBAAsB,AACtB,oBAAqB,AACrB,eAAgB,AAChB,UAAW,AACX,iBAAmB,AACnB,kBAAmB,AACnB,oBAAsB,CACvB,AACD,oCACE,yBAA0B,AAC1B,WAAY,AACZ,cAAgB,CACjB,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,yBACE,YAAc,CACf,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,yBACA,iCACI,eAAiB,CACpB,CACA,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,yBACA,gCACI,eAAiB,CACpB,CACA,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,6BACE,wBAA0B,AAC1B,cAAe,AACf,gBAAiB,AACjB,eAAgB,AAChB,WAAY,AACZ,UAAW,AACX,SAAU,AACV,mBAAoB,AACpB,UAAW,AACX,mBAAqB,CACtB,AACD,qCACE,SAAU,AACV,UAAW,AACX,kBAAoB,CACrB,AACD,iDACE,YAAa,AACb,iBAAkB,AAClB,iBAAmB,CACpB,AACD,oDACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,oDACE,mBAAoB,AACpB,sBAAuB,AACvB,kBAAmB,AACnB,iBAAmB,CACpB,AACD,sDACE,eAAmB,CACpB",file:"DemoModal.vue",sourcesContent:["\n.pure-button[data-v-154896f1] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n  display: inline-block;\n  font-family: inherit;\n  font-size: 100%;\n  outline: 0;\n  padding: 0.5em 1em;\n  text-align: center;\n  text-decoration: none;\n}\n.pure-button[data-v-154896f1]:hover {\n  background-color: #29b474;\n  color: #fff;\n  cursor: pointer;\n}\n.pure-button.full-width[data-v-154896f1] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-154896f1] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-154896f1]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-154896f1] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-154896f1]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-154896f1] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-154896f1]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-154896f1] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-154896f1]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-154896f1] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-154896f1]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-154896f1] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-154896f1] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-154896f1]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-154896f1],\nbody[data-v-154896f1] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.hidden[data-v-154896f1] {\n  display: none;\n}\n.pull-left[data-v-154896f1] {\n  float: left;\n}\n.pull-right[data-v-154896f1] {\n  float: right;\n}\n.clearfix[data-v-154896f1] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-154896f1] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-154896f1] {\n  margin: 0 !important;\n}\n.no-padding[data-v-154896f1] {\n  padding: 0 !important;\n}\n.background-white[data-v-154896f1] {\n  background-color: #fff !important;\n}\n.text-white[data-v-154896f1] {\n  color: #fff;\n}\n.fade-enter-active[data-v-154896f1],\n.fade-leave-active[data-v-154896f1] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-154896f1],\n.fade-leave-to[data-v-154896f1] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-154896f1],\n.fade-leave[data-v-154896f1] {\n  opacity: 1;\n}\n.main-container[data-v-154896f1] {\n  border-radius: 4px;\n  position: relative;\n}\n@media (max-width: 800px) {\n.main-container[data-v-154896f1] {\n    border-radius: 0;\n}\n}\n.main-container.main-container-padded[data-v-154896f1] {\n  padding: 20px;\n}\n.content-block[data-v-154896f1] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n@media (max-width: 800px) {\n.content-block[data-v-154896f1] {\n    border-radius: 0;\n}\n}\n.content-block.white-block[data-v-154896f1] {\n  background-color: #fff;\n}\n.icon-margin[data-v-154896f1] {\n  margin: 0 5px;\n}\n#demo-modal[data-v-154896f1] {\n  transition: all 0.3s ease;\n  display: block;\n  max-width: 320px;\n  position: fixed;\n  z-index: 57;\n  top: 120px;\n  left: 50%;\n  margin-left: -160px;\n  opacity: 0;\n  pointer-events: none;\n}\n#demo-modal.visible[data-v-154896f1] {\n  top: 80px;\n  opacity: 1;\n  pointer-events: all;\n}\n#demo-modal #demo-modal--header[data-v-154896f1] {\n  height: 40px;\n  line-height: 40px;\n  text-align: center;\n}\n#demo-modal #demo-modal--header h1[data-v-154896f1] {\n  margin: 0;\n  padding: 0;\n  color: #fff;\n  font-size: 1.2em;\n}\n#demo-modal #demo-modal--container[data-v-154896f1] {\n  border-radius: 12px;\n  background-color: #fff;\n  padding: 20px 30px;\n  text-align: center;\n}\n#demo-modal #demo-modal--container p[data-v-154896f1] {\n  margin: 0 0 20px 0;\n}"],sourceRoot:""}])},722:function(n,o,t){var a=t(666);"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);t(288)("1b3be708",a,!0)},874:function(n,o){n.exports={render:function(){var n=this,o=n.$createElement,t=n._self._c||o;return t("div",{class:{visible:n.demoModalVisible},attrs:{id:"demo-modal"}},[t("div",{attrs:{id:"demo-modal--header"}},[t("h1",[n._v(n._s(n.$t("demo.unavailable_title")))])]),t("div",{attrs:{id:"demo-modal--container"}},[t("p",[n._v(n._s(n.$t("demo.unavailable_description")))]),t("button",{staticClass:"pure-button pure-button-primary",on:{click:n.closeModal}},[n._v(n._s(n.$t("common.confirm")))])])])},staticRenderFns:[]}}});