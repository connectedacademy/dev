webpackJsonp([26],{597:function(o,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"soundcloud-embed",props:["soundcloudSrc"],data:function(){return{theSrc:void 0}},mounted:function(){var o=this;setTimeout(function(){o.theSrc="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/"+o.soundcloudSrc},2500)}}},671:function(o,e,n){e=o.exports=n(288)(),e.push([o.i,".soundcloud-wrapper .soundcloud-container[data-v-25b27813]{margin-top:20px;position:relative}","",{version:3,sources:["/root/connectedacademy/src/components/SoundcloudEmbed.vue"],names:[],mappings:"AACA,2DACE,gBAAiB,AACjB,iBAAmB,CACpB",file:"SoundcloudEmbed.vue",sourcesContent:["\n.soundcloud-wrapper .soundcloud-container[data-v-25b27813] {\n  margin-top: 20px;\n  position: relative;\n}"],sourceRoot:""}])},727:function(o,e,n){var t=n(671);"string"==typeof t&&(t=[[o.i,t,""]]),t.locals&&(o.exports=t.locals);n(289)("ea2e7ce6",t,!0)},838:function(o,e,n){n(727);var t=n(9)(n(597),n(881),"data-v-25b27813",null);o.exports=t.exports},881:function(o,e){o.exports={render:function(){var o=this,e=o.$createElement,n=o._self._c||e;return n("div",{staticClass:"soundcloud-wrapper"},[o.theSrc?n("div",{staticClass:"soundcloud-container"},[o._m(0)]):o._e()])},staticRenderFns:[function(){var o=this,e=o.$createElement;return(o._self._c||e)("iframe",{attrs:{src:o.theSrc,width:"100%",height:"166",scrolling:"no",frameborder:"no"}})}]}}});