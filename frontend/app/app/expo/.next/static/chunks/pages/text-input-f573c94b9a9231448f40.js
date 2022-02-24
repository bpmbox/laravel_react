(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[183],{2307:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return p}});var r=n(7294),o=n(4099),l=n.n(o),u=n(4941),a=n.n(u),i=n(9057),c=n.n(i),s=n(6492),d=n(5893);function p(){var e=r.useRef(null);return(0,d.jsx)(s.Z,{title:"TextInput",children:(0,d.jsxs)(c(),{style:f.container,children:[(0,d.jsx)(a(),{autoFocus:!0,onFocus:function(){console.log("focused")},style:f.textinput}),(0,d.jsx)(a(),{blurOnSubmit:!0,onSubmitEditing:function(){null!=e.current&&e.current.focus()},placeholder:"blurOnSubmit",style:f.textinput}),(0,d.jsx)(a(),{clearTextOnFocus:!0,defaultValue:"clearTextOnFocus",ref:e,style:f.textinput}),(0,d.jsx)(a(),{defaultValue:"disabled",disabled:!0,style:f.textinput}),(0,d.jsx)(a(),{defaultValue:"editable (false)",editable:!1,style:f.textinput}),(0,d.jsx)(a(),{keyboardType:"numeric",placeholder:"keyboardType 'numeric'",style:f.textinput}),(0,d.jsx)(a(),{maxLength:5,placeholder:"maxLength",style:f.textinput}),(0,d.jsx)(a(),{placeholder:"placeholderTextColor",placeholderTextColor:"orange",style:f.textinput}),(0,d.jsx)(a(),{defaultValue:"selectTextOnFocus",selectTextOnFocus:!0,style:f.textinput}),(0,d.jsx)(a(),{defaultValue:"secureTextEntry",secureTextEntry:!0,style:f.textinput}),(0,d.jsx)(a(),{multiline:!0,numberOfLines:3,placeholder:"multiline",style:f.multiline})]})})}var f=l().create({container:{alignSelf:"stretch",padding:"1rem"},textinput:{height:26,borderWidth:.5,borderColor:"#0f0f0f",padding:4,marginVertical:"1rem"},multiline:{borderWidth:.5,borderColor:"#0f0f0f",padding:4,marginVertical:"1rem"}})},6492:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(4099),o=n.n(r),l=n(8409),u=n.n(l),a=n(9057),i=n.n(a),c=n(5893);function s(e){return(0,c.jsxs)(i(),{style:d.root,children:[(0,c.jsxs)(i(),{style:d.header,children:[(0,c.jsx)(u(),{accessibilityLabel:"Back",href:"/",style:d.back,children:(0,c.jsx)("svg",{style:{fill:"#555",height:"100%"},viewBox:"0 0 140 140",xmlns:"http://www.w3.org/2000/svg",children:(0,c.jsx)("path",{d:"M105.614 118.681c3.398 3.396 3.4 8.912 0 12.311-3.396 3.399-8.91 3.398-12.311 0-.02-.02-.035-.04-.053-.061l-.025.022-57.66-57.66.024-.022a8.664 8.664 0 01-2.608-6.208 8.672 8.672 0 013.229-6.762l-.06-.058 57.66-57.66.025.024c.018-.021.033-.039.053-.058A8.706 8.706 0 01106.2 14.86c-.021.02-.041.034-.061.054l.023.024-52.119 52.125 51.54 51.54-.025.021c.015.022.036.036.056.057"})})}),(0,c.jsx)(u(),{accessibilityRole:"heading",style:d.title,children:e.title})]}),(0,c.jsx)(i(),{style:d.container,children:e.children})]})}var d=o().create({root:{height:"100vh"},header:{paddingVertical:"1em",borderBottomColor:"#ccc",borderBottomWidth:1},title:{fontSize:18,fontWeight:"bold",textAlign:"center"},back:{position:"absolute",height:"100%",display:"flex",padding:10,left:0,top:0,width:40,alignItems:"center"},container:{alignItems:"center",flex:1,overflowY:"scroll"}})},9026:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/text-input",function(){return n(2307)}])},4941:function(e,t,n){"use strict";t.__esModule=!0,t.default=void 0;var r=b(n(7294)),o=v(n(3820)),l=v(n(5593)),u=b(n(4475)),a=v(n(7447)),i=v(n(8954)),c=v(n(3320)),s=v(n(8391)),d=v(n(2187)),p=v(n(6758)),f=v(n(4099)),h=v(n(551));function v(e){return e&&e.__esModule?e:{default:e}}function y(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return y=function(){return e},e}function b(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=y();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var l=r?Object.getOwnPropertyDescriptor(e,o):null;l&&(l.get||l.set)?Object.defineProperty(n,o,l):n[o]=e[o]}return n.default=e,t&&t.set(e,n),n}function x(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?x(Object(n),!0).forEach((function(t){S(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):x(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function S(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var m=g(g(g(g(g(g(g(g(g({},u.defaultProps),u.accessibilityProps),u.clickProps),u.focusProps),u.keyboardProps),u.mouseProps),u.touchProps),u.styleProps),{},{autoCapitalize:!0,autoComplete:!0,autoCorrect:!0,autoFocus:!0,defaultValue:!0,disabled:!0,lang:!0,maxLength:!0,onChange:!0,onScroll:!0,placeholder:!0,pointerEvents:!0,readOnly:!0,rows:!0,spellCheck:!0,value:!0,type:!0});var C=r.forwardRef((function(e,t){var n,l,u=e.autoCapitalize,v=void 0===u?"sentences":u,y=e.autoComplete,b=e.autoCompleteType,x=e.autoCorrect,g=void 0===x||x,S=e.blurOnSubmit,C=e.clearTextOnFocus,O=e.dir,j=e.editable,w=void 0===j||j,_=e.keyboardType,k=void 0===_?"default":_,T=e.multiline,E=void 0!==T&&T,P=e.numberOfLines,F=void 0===P?1:P,M=e.onBlur,N=e.onChange,z=e.onChangeText,D=e.onContentSizeChange,V=e.onFocus,L=e.onKeyPress,W=e.onLayout,B=e.onMoveShouldSetResponder,I=e.onMoveShouldSetResponderCapture,K=e.onResponderEnd,A=e.onResponderGrant,q=e.onResponderMove,G=e.onResponderReject,H=e.onResponderRelease,X=e.onResponderStart,Z=e.onResponderTerminate,Y=e.onResponderTerminationRequest,J=e.onScrollShouldSetResponder,Q=e.onScrollShouldSetResponderCapture,U=e.onSelectionChange,$=e.onSelectionChangeShouldSetResponder,ee=e.onSelectionChangeShouldSetResponderCapture,te=e.onStartShouldSetResponder,ne=e.onStartShouldSetResponderCapture,re=e.onSubmitEditing,oe=e.placeholderTextColor,le=e.returnKeyType,ue=e.secureTextEntry,ae=void 0!==ue&&ue,ie=e.selection,ce=e.selectTextOnFocus,se=e.spellCheck;switch(k){case"email-address":n="email";break;case"number-pad":case"numeric":l="numeric";break;case"decimal-pad":l="decimal";break;case"phone-pad":n="tel";break;case"search":case"web-search":n="search";break;case"url":n="url";break;default:n="text"}ae&&(n="password");var de=r.useRef({height:null,width:null}),pe=r.useRef(null),fe=r.useCallback((function(e){if(E&&D&&null!=e){var t=e.scrollHeight,n=e.scrollWidth;t===de.current.height&&n===de.current.width||(de.current.height=t,de.current.width=n,D({nativeEvent:{contentSize:{height:de.current.height,width:de.current.width}}}))}}),[E,D]),he=r.useMemo((function(){return function(e){null!=e&&(e.clear=function(){null!=e&&(e.value="")},e.isFocused=function(){return null!=e&&h.default.currentlyFocusedField()===e},fe(e))}}),[fe]);(0,c.default)((function(){var e=pe.current;null!=e&&null!=ie&&function(e,t){if(function(e,t){var n=e.selectionEnd,r=e.selectionStart,o=t.start,l=t.end;return o!==r||l!==n}(e,t)){var n=t.start,r=t.end;try{e.setSelectionRange(n,r||n)}catch(o){}}}(e,ie),document.activeElement===e&&(h.default._currentlyFocusedNode=e)}),[pe,ie]);var ve=E?"textarea":"input",ye=[R.textinput],be=f.default.compose(e.style,oe&&{placeholderTextColor:oe});(0,i.default)(pe,W),(0,p.default)(pe,{onMoveShouldSetResponder:B,onMoveShouldSetResponderCapture:I,onResponderEnd:K,onResponderGrant:A,onResponderMove:q,onResponderReject:G,onResponderRelease:H,onResponderStart:X,onResponderTerminate:Z,onResponderTerminationRequest:Y,onScrollShouldSetResponder:J,onScrollShouldSetResponderCapture:Q,onSelectionChangeShouldSetResponder:$,onSelectionChangeShouldSetResponderCapture:ee,onStartShouldSetResponder:te,onStartShouldSetResponderCapture:ne});var xe=function(e){return(0,a.default)(e,m)}(e);xe.autoCapitalize=v,xe.autoComplete=y||b||"on",xe.autoCorrect=g?"on":"off",xe.classList=ye,xe.dir=void 0!==O?O:"auto",xe.enterKeyHint=le,xe.onBlur=function(e){h.default._currentlyFocusedNode=null,M&&(e.nativeEvent.text=e.target.value,M(e))},xe.onChange=function(e){var t=e.target,n=t.value;e.nativeEvent.text=n,fe(t),N&&N(e),z&&z(n)},xe.onFocus=function(e){var t=e.target;V&&(e.nativeEvent.text=t.value,V(e)),null!=t&&(h.default._currentlyFocusedNode=t,C&&(t.value=""),ce&&setTimeout((function(){t.select()}),0))},xe.onKeyDown=function(e){var t=e.target;e.stopPropagation();var n=null==S?!E:S,r=e.nativeEvent,o=function(e){return e.isComposing||229===e.keyCode}(r);L&&L(e),"Enter"!==e.key||e.shiftKey||o||e.isDefaultPrevented()||(!S&&E||!re||(e.preventDefault(),r.text=e.target.value,re(e)),n&&null!=t&&t.blur())},xe.onSelect=function(e){if(U)try{var t=e.target,n=t.selectionStart,r=t.selectionEnd;e.nativeEvent.selection={start:n,end:r},e.nativeEvent.text=e.target.value,U(e)}catch(e){}},xe.readOnly=!w,xe.rows=E?F:void 0,xe.spellCheck=null!=se?se:g,xe.style=be,xe.type=E?void 0:n,xe.inputMode=l;var ge=(0,d.default)(xe),Se=(0,s.default)(pe,ge,he,t);return xe.ref=Se,(0,o.default)(ve,xe)}));C.displayName="TextInput",C.State=h.default;var R=l.default.create({textinput:{MozAppearance:"textfield",WebkitAppearance:"none",backgroundColor:"transparent",border:"0 solid black",borderRadius:0,boxSizing:"border-box",font:"14px System",margin:0,padding:0,resize:"none"}}),O=C;t.default=O,e.exports=t.default},551:function(e,t,n){"use strict";t.__esModule=!0,t.default=void 0;var r,o=(r=n(6629))&&r.__esModule?r:{default:r};var l={_currentlyFocusedNode:null,currentlyFocusedField:function(){return document.activeElement!==this._currentlyFocusedNode&&(this._currentlyFocusedNode=null),this._currentlyFocusedNode},focusTextInput:function(e){null!==e&&(this._currentlyFocusedNode=e,document.activeElement!==e&&o.default.focus(e))},blurTextInput:function(e){null!==e&&(this._currentlyFocusedNode=null,document.activeElement===e&&o.default.blur(e))}};t.default=l,e.exports=t.default}},function(e){e.O(0,[774,193,888,179],(function(){return t=9026,e(e.s=t);var t}));var t=e.O();_N_E=t}]);