webpackJsonp([8],{690:function(e,t,n){n(778);var o=n(0)(n(753),n(867),"data-v-202d1e22",null);e.exports=o.exports},753:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),r=n.n(o),a=n(10),i=n(2),s=n(181),c=n.n(s);t.default={name:"about",beforeRouteEnter:function(e,t,n){n(function(e){e.$store.commit(a.d,{minimized:!1}),e.$store.commit(a.e,void 0)})},components:{MarkdownRenderer:c.a},data:function(){return{navTitle:"About - Connected Academy"}},computed:r()({},n.i(i.b)(["course"]),{markdownUrl:function(){return this.course.baseUri+"about.md"}})}},758:function(e,t,n){t=e.exports=n(678)(),t.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"About.vue",sourceRoot:""}])},778:function(e,t,n){var o=n(758);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);n(679)("91c6349e",o,!0)},867:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"about-page",attrs:{name:"about-page"}},[n("div",{staticClass:"col",attrs:{id:"col-main"}},[n("div",{staticClass:"main-container main-container-padded background-white"},[n("markdown-renderer",{attrs:{"markdown-url":e.markdownUrl}})],1)])])},staticRenderFns:[]}}});