(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[543],{7911:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return P}});var r=n(885),o=n(2982),i=n(7294),l=n(5959),a=n.n(l),s=n(8174),c=n.n(s),u=n(4099),f=n.n(u),d=n(8409),y=n.n(d),b=n(8908),h=n.n(b),p=n(9057),v=n.n(p),g=n(6492),m=n(5893),w=(0,o.Z)(Array(12)).map((function(e,t){return"Item ".concat(t)}));function x(e,t){return(0,m.jsx)(h(),{style:[O.item],children:(0,m.jsx)(y(),{style:O.text,children:e})},t)}function j(){return(0,m.jsx)(v(),{style:O.divider})}function P(){var e=i.useState(!0),t=(0,r.Z)(e,2),n=t[0],o=t[1],l=i.useState(16),s=(0,r.Z)(l,2),u=s[0],f=s[1],d=i.useRef(null);return(0,m.jsx)(g.Z,{title:"ScrollView",children:(0,m.jsxs)(v(),{style:O.container,children:[(0,m.jsx)(c(),{onScroll:function(){console.log("onScroll")},ref:d,scrollEnabled:n,scrollEventThrottle:u,style:[O.scrollView,!n&&O.disabled],children:w.map(x)}),(0,m.jsxs)(v(),{style:O.buttons,children:[(0,m.jsx)(a(),{onPress:function(){o((function(e){return!e}))},title:n?"Disable":"Enable"}),(0,m.jsx)(j,{}),(0,m.jsx)(a(),{onPress:function(){f((function(e){return 16!==e?16:1e3}))},title:"Throttle"})]}),(0,m.jsxs)(v(),{style:O.buttons,children:[(0,m.jsx)(a(),{onPress:function(){d.current.scrollTo({y:0})},title:"To start"}),(0,m.jsx)(j,{}),(0,m.jsx)(a(),{onPress:function(){d.current.scrollTo({y:50})},title:"To 50px"}),(0,m.jsx)(j,{}),(0,m.jsx)(a(),{onPress:function(){d.current.scrollToEnd({animated:!0})},title:"To end"})]})]})})}var O=f().create({container:{alignSelf:"stretch"},scrollView:{backgroundColor:"#eeeeee",maxHeight:250},disabled:{opacity:.5},item:{margin:5,padding:5,backgroundColor:"#cccccc",borderRadius:3,minWidth:96},text:{fontSize:16,fontWeight:"bold",margin:5},buttons:{flexDirection:"row",justifyContent:"center",marginVertical:"1rem"},divider:{width:"1rem"}})},6492:function(e,t,n){"use strict";n.d(t,{Z:function(){return u}});var r=n(4099),o=n.n(r),i=n(8409),l=n.n(i),a=n(9057),s=n.n(a),c=n(5893);function u(e){return(0,c.jsxs)(s(),{style:f.root,children:[(0,c.jsxs)(s(),{style:f.header,children:[(0,c.jsx)(l(),{accessibilityLabel:"Back",href:"/",style:f.back,children:(0,c.jsx)("svg",{style:{fill:"#555",height:"100%"},viewBox:"0 0 140 140",xmlns:"http://www.w3.org/2000/svg",children:(0,c.jsx)("path",{d:"M105.614 118.681c3.398 3.396 3.4 8.912 0 12.311-3.396 3.399-8.91 3.398-12.311 0-.02-.02-.035-.04-.053-.061l-.025.022-57.66-57.66.024-.022a8.664 8.664 0 01-2.608-6.208 8.672 8.672 0 013.229-6.762l-.06-.058 57.66-57.66.025.024c.018-.021.033-.039.053-.058A8.706 8.706 0 01106.2 14.86c-.021.02-.041.034-.061.054l.023.024-52.119 52.125 51.54 51.54-.025.021c.015.022.036.036.056.057"})})}),(0,c.jsx)(l(),{accessibilityRole:"heading",style:f.title,children:e.title})]}),(0,c.jsx)(s(),{style:f.container,children:e.children})]})}var f=o().create({root:{height:"100vh"},header:{paddingVertical:"1em",borderBottomColor:"#ccc",borderBottomWidth:1},title:{fontSize:18,fontWeight:"bold",textAlign:"center"},back:{position:"absolute",height:"100%",display:"flex",padding:10,left:0,top:0,width:40,alignItems:"center"},container:{alignItems:"center",flex:1,overflowY:"scroll"}})},4591:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/scroll-view",function(){return n(7911)}])},5959:function(e,t,n){"use strict";t.__esModule=!0,t.default=void 0;var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=s();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var i=r?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=e[o]}n.default=e,t&&t.set(e,n);return n}(n(7294)),o=a(n(4099)),i=a(n(8908)),l=a(n(8409));function a(e){return e&&e.__esModule?e:{default:e}}function s(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return s=function(){return e},e}var c=r.forwardRef((function(e,t){var n=e.accessibilityLabel,o=e.color,a=e.disabled,s=e.onPress,c=e.testID,f=e.title;return r.createElement(i.default,{accessibilityLabel:n,accessibilityRole:"button",disabled:a,focusable:!a,onPress:s,ref:t,style:[u.button,o&&{backgroundColor:o},a&&u.buttonDisabled],testID:c},r.createElement(l.default,{style:[u.text,a&&u.textDisabled]},f))}));c.displayName="Button";var u=o.default.create({button:{backgroundColor:"#2196F3",borderRadius:2},text:{color:"#fff",fontWeight:"500",padding:8,textAlign:"center",textTransform:"uppercase"},buttonDisabled:{backgroundColor:"#dfdfdf"},textDisabled:{color:"#a1a1a1"}}),f=c;t.default=f,e.exports=t.default},3256:function(e,t,n){"use strict";t.__esModule=!0,t.default=void 0;var r,o=n(6508),i=(r=n(3759))&&r.__esModule?r:{default:r};var l={window:{fontScale:1,height:0,scale:1,width:0},screen:{fontScale:1,height:0,scale:1,width:0}},a={},s=function(){function e(){}return e.get=function(e){return(0,i.default)(l[e],"No dimension set for key "+e),l[e]},e.set=function(e){e&&(o.canUseDOM?(0,i.default)(!1,"Dimensions cannot be set in the browser"):(null!=e.screen&&(l.screen=e.screen),null!=e.window&&(l.window=e.window)))},e._update=function(){if(o.canUseDOM){var e=window,t=e.document.documentElement;l.window={fontScale:1,height:t.clientHeight,scale:e.devicePixelRatio||1,width:t.clientWidth},l.screen={fontScale:1,height:e.screen.height,scale:e.devicePixelRatio||1,width:e.screen.width},Array.isArray(a.change)&&a.change.forEach((function(e){return e(l)}))}},e.addEventListener=function(e,t){var n=this;return a[e]=a[e]||[],a[e].push(t),{remove:function(){n.removeEventListener(e,t)}}},e.removeEventListener=function(e,t){Array.isArray(a[e])&&(a[e]=a[e].filter((function(e){return e!==t})))},e}();t.default=s,o.canUseDOM&&(s._update(),window.addEventListener("resize",s._update,!1)),e.exports=t.default},8908:function(e,t,n){"use strict";t.__esModule=!0,t.default=void 0;var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=c();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var i=r?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=e[o]}n.default=e,t&&t.set(e,n);return n}(n(7294)),o=s(n(8391)),i=s(n(4982)),l=s(n(4099)),a=s(n(9057));function s(e){return e&&e.__esModule?e:{default:e}}function c(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return c=function(){return e},e}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function f(e,t){var n=e.activeOpacity,l=e.delayPressIn,s=e.delayPressOut,c=e.delayLongPress,f=e.disabled,y=e.focusable,b=e.onLongPress,h=e.onPress,p=e.onPressIn,v=e.onPressOut,g=e.rejectResponderTermination,m=e.style,w=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,["activeOpacity","delayPressIn","delayPressOut","delayLongPress","disabled","focusable","onLongPress","onPress","onPressIn","onPressOut","rejectResponderTermination","style"]),x=(0,r.useRef)(null),j=(0,o.default)(t,x),P=(0,r.useState)("0s"),O=P[0],_=P[1],S=(0,r.useState)(null),k=S[0],E=S[1],D=(0,r.useCallback)((function(e,t){E(e),_(t?t/1e3+"s":"0s")}),[E,_]),A=(0,r.useCallback)((function(e){D(null!==n&&void 0!==n?n:.2,e)}),[n,D]),M=(0,r.useCallback)((function(e){D(null,e)}),[D]),T=(0,r.useMemo)((function(){return{cancelable:!g,disabled:f,delayLongPress:c,delayPressStart:l,delayPressEnd:s,onLongPress:b,onPress:h,onPressStart:function(e){var t=null!=e.dispatchConfig?"onResponderGrant"===e.dispatchConfig.registrationName:"keydown"===e.type;A(t?0:150),null!=p&&p(e)},onPressEnd:function(e){M(250),null!=v&&v(e)}}}),[c,l,s,f,b,h,p,v,g,A,M]),C=(0,i.default)(x,T);return r.createElement(a.default,u({},w,C,{accessibilityDisabled:f,focusable:!f&&!1!==y,ref:j,style:[d.root,!f&&d.actionable,m,null!=k&&{opacity:k},{transitionDuration:O}]}))}var d=l.default.create({root:{transitionProperty:"opacity",transitionDuration:"0.15s",userSelect:"none"},actionable:{cursor:"pointer",touchAction:"manipulation"}}),y=r.memo(r.forwardRef(f));y.displayName="TouchableOpacity";var b=y;t.default=b,e.exports=t.default},907:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}n.d(t,{Z:function(){return r}})},885:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var r=n(181);function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i=[],l=!0,a=!1;try{for(n=n.call(e);!(l=(r=n.next()).done)&&(i.push(r.value),!t||i.length!==t);l=!0);}catch(s){a=!0,o=s}finally{try{l||null==n.return||n.return()}finally{if(a)throw o}}return i}}(e,t)||(0,r.Z)(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},2982:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var r=n(907);var o=n(181);function i(e){return function(e){if(Array.isArray(e))return(0,r.Z)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||(0,o.Z)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},181:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var r=n(907);function o(e,t){if(e){if("string"===typeof e)return(0,r.Z)(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?(0,r.Z)(e,t):void 0}}}},function(e){e.O(0,[774,193,295,174,888,179],(function(){return t=4591,e(e.s=t);var t}));var t=e.O();_N_E=t}]);