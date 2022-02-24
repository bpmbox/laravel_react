(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[479],{9652:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return h}});var r=n(885),i=n(9009),o=n.n(i),a=n(4099),l=n.n(a),s=n(9057),c=n.n(s),u=n(7294),f=n(6492),d=n(5893);function h(){var t=u.useState(!0),e=(0,r.Z)(t,2),n=e[0],i=e[1];return u.useEffect((function(){var t=setInterval((function(){i(!n)}),2e3);return function(){clearInterval(t)}}),[n]),(0,d.jsxs)(f.Z,{title:"ActivityIndicator",children:[(0,d.jsxs)(c(),{style:y.row,children:[(0,d.jsx)(o(),{style:y.item}),(0,d.jsx)(o(),{animating:!1,hidesWhenStopped:!1,style:y.item}),(0,d.jsx)(o(),{animating:n,hidesWhenStopped:!1,style:y.item})]}),(0,d.jsxs)(c(),{style:y.row,children:[(0,d.jsx)(o(),{color:"#1DA1F2",size:"small",style:y.item}),(0,d.jsx)(o(),{color:"#17BF63",size:20,style:y.item})]}),(0,d.jsxs)(c(),{style:y.row,children:[(0,d.jsx)(o(),{color:"#FFAD1F",size:"large",style:y.item}),(0,d.jsx)(o(),{color:"#F45D22",size:36,style:y.item})]}),(0,d.jsx)(c(),{style:y.row,children:(0,d.jsx)(o(),{color:"#794BC4",size:60,style:y.item})})]})}var y=l().create({row:{alignItems:"center",flexDirection:"row",marginVertical:20},item:{paddingHorizontal:10}})},6492:function(t,e,n){"use strict";n.d(e,{Z:function(){return u}});var r=n(4099),i=n.n(r),o=n(8409),a=n.n(o),l=n(9057),s=n.n(l),c=n(5893);function u(t){return(0,c.jsxs)(s(),{style:f.root,children:[(0,c.jsxs)(s(),{style:f.header,children:[(0,c.jsx)(a(),{accessibilityLabel:"Back",href:"/",style:f.back,children:(0,c.jsx)("svg",{style:{fill:"#555",height:"100%"},viewBox:"0 0 140 140",xmlns:"http://www.w3.org/2000/svg",children:(0,c.jsx)("path",{d:"M105.614 118.681c3.398 3.396 3.4 8.912 0 12.311-3.396 3.399-8.91 3.398-12.311 0-.02-.02-.035-.04-.053-.061l-.025.022-57.66-57.66.024-.022a8.664 8.664 0 01-2.608-6.208 8.672 8.672 0 013.229-6.762l-.06-.058 57.66-57.66.025.024c.018-.021.033-.039.053-.058A8.706 8.706 0 01106.2 14.86c-.021.02-.041.034-.061.054l.023.024-52.119 52.125 51.54 51.54-.025.021c.015.022.036.036.056.057"})})}),(0,c.jsx)(a(),{accessibilityRole:"heading",style:f.title,children:t.title})]}),(0,c.jsx)(s(),{style:f.container,children:t.children})]})}var f=i().create({root:{height:"100vh"},header:{paddingVertical:"1em",borderBottomColor:"#ccc",borderBottomWidth:1},title:{fontSize:18,fontWeight:"bold",textAlign:"center"},back:{position:"absolute",height:"100%",display:"flex",padding:10,left:0,top:0,width:40,alignItems:"center"},container:{alignItems:"center",flex:1,overflowY:"scroll"}})},9581:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/activity-indicator",function(){return n(9652)}])},9009:function(t,e,n){"use strict";e.__esModule=!0,e.default=void 0;var r=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==typeof t&&"function"!==typeof t)return{default:t};var e=l();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)){var o=r?Object.getOwnPropertyDescriptor(t,i):null;o&&(o.get||o.set)?Object.defineProperty(n,i,o):n[i]=t[i]}n.default=t,e&&e.set(t,n);return n}(n(7294)),i=a(n(4099)),o=a(n(9057));function a(t){return t&&t.__esModule?t:{default:t}}function l(){if("function"!==typeof WeakMap)return null;var t=new WeakMap;return l=function(){return t},t}function s(){return(s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}var c={max:1,min:0},u=function(t){return r.createElement("circle",{cx:"16",cy:"16",fill:"none",r:"14",strokeWidth:"4",style:t})},f=r.forwardRef((function(t,e){var n=t.animating,i=void 0===n||n,a=t.color,l=void 0===a?"#1976D2":a,f=t.hidesWhenStopped,y=void 0===f||f,p=t.size,m=void 0===p?"small":p,v=t.style,g=function(t,e){if(null==t)return{};var n,r,i={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(i[n]=t[n]);return i}(t,["animating","color","hidesWhenStopped","size","style"]),b=r.createElement("svg",{height:"100%",viewBox:"0 0 32 32",width:"100%"},u({stroke:l,opacity:.2}),u({stroke:l,strokeDasharray:80,strokeDashoffset:60}));return r.createElement(o.default,s({},g,{accessibilityRole:"progressbar",accessibilityValue:c,ref:e,style:[d.container,v]}),r.createElement(o.default,{children:b,style:["number"===typeof m?{height:m,width:m}:h[m],d.animation,!i&&d.animationPause,!i&&y&&d.hidesWhenStopped]}))}));f.displayName="ActivityIndicator";var d=i.default.create({container:{alignItems:"center",justifyContent:"center"},hidesWhenStopped:{visibility:"hidden"},animation:{animationDuration:"0.75s",animationKeyframes:[{"0%":{transform:[{rotate:"0deg"}]},"100%":{transform:[{rotate:"360deg"}]}}],animationTimingFunction:"linear",animationIterationCount:"infinite"},animationPause:{animationPlayState:"paused"}}),h=i.default.create({small:{width:20,height:20},large:{width:36,height:36}}),y=f;e.default=y,t.exports=e.default},907:function(t,e,n){"use strict";function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}n.d(e,{Z:function(){return r}})},885:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var r=n(181);function i(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,o=[],a=!0,l=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(o.push(r.value),!e||o.length!==e);a=!0);}catch(s){l=!0,i=s}finally{try{a||null==n.return||n.return()}finally{if(l)throw i}}return o}}(t,e)||(0,r.Z)(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},181:function(t,e,n){"use strict";n.d(e,{Z:function(){return i}});var r=n(907);function i(t,e){if(t){if("string"===typeof t)return(0,r.Z)(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?(0,r.Z)(t,e):void 0}}}},function(t){t.O(0,[774,193,888,179],(function(){return e=9581,t(t.s=e);var e}));var e=t.O();_N_E=e}]);