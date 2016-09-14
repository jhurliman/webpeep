/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';var _audioLibrary=__webpack_require__(1),_audioLibrary2=_interopRequireDefault(_audioLibrary),_hackerNewsAuralizer=__webpack_require__(10),_hackerNewsAuralizer2=_interopRequireDefault(_hackerNewsAuralizer),_randomSignalMapper=__webpack_require__(14),_randomSignalMapper2=_interopRequireDefault(_randomSignalMapper),_signalType=__webpack_require__(13),_signalType2=_interopRequireDefault(_signalType);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var LIBRARY_URLS=['https://d1b1y29frn0aw8.cloudfront.net/wetlands/coupled/__INDEX__','https://d1b1y29frn0aw8.cloudfront.net/wetlands/events/__INDEX__','https://d1b1y29frn0aw8.cloudfront.net/wetlands/heartbeats/__INDEX__','https://d1b1y29frn0aw8.cloudfront.net/wetlands/states/__INDEX__'],audioCtx=void 0,library=void 0,auralizer=void 0,signalMapper=void 0;document.addEventListener('DOMContentLoaded',function(){audioCtx=new(window.AudioContext||window.webkitAudioContext),audioCtx.masterVolume=audioCtx.createGain(),audioCtx.masterVolume.connect(audioCtx.destination),library=new _audioLibrary2.default(LIBRARY_URLS,{fileExtension:'.m4a'}),library.load(audioCtx).then(function(){auralizer=new _hackerNewsAuralizer2.default,signalMapper=new _randomSignalMapper2.default(auralizer,library),signalMapper.startLoadAudio(),setTimeout(function(){return auralizer.start()},1000),setupUI()})});function setupUI(){var a=document.getElementById('mute-button'),b=document.getElementById('unmute-button');a.addEventListener('click',function(){a.style.display='none',b.style.display='inherit',audioCtx.masterVolume.gain.value=0}),b.addEventListener('click',function(){a.style.display='inherit',b.style.display='none',audioCtx.masterVolume.gain.value=1}),document.addEventListener('play-sound',function(c){c.detail.type===_signalType2.default.STATE&&(document.body.style.backgroundPositionX=100*c.detail.intensity+'%')})}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _eventSound=__webpack_require__(2),_eventSound2=_interopRequireDefault(_eventSound),_heartbeatSound=__webpack_require__(7),_heartbeatSound2=_interopRequireDefault(_heartbeatSound),_stateSound=__webpack_require__(8),_stateSound2=_interopRequireDefault(_stateSound),_utils=__webpack_require__(4),_utils2=_interopRequireDefault(_utils),_libraryParser=__webpack_require__(9),_libraryParser2=_interopRequireDefault(_libraryParser);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}var a=function(){function a(b){var c=1>=arguments.length||void 0===arguments[1]?{}:arguments[1];_classCallCheck(this,a),this.indexUrls=b,this.options=c,this.coupledSounds=[],this.eventSounds=[],this.heartbeatSounds=[],this.stateSounds=[]}return _createClass(a,[{key:'load',value:function load(b){var _this=this;return Promise.all(this.indexUrls.map(function(c){return _utils2.default.request(c).then(function(d){return _this.parseIndexFile(b,d,c)})})).then(function(){console.log(`Loaded ${_this.coupledSounds.length} coupled sounds, `+`${_this.eventSounds.length} event sounds, `+`${_this.heartbeatSounds.length} heartbeat sounds, `+`and ${_this.stateSounds.length} state sounds`)})}},{key:'parseIndexFile',value:function parseIndexFile(b,c,d){var _this2=this,e=d.replace(/__INDEX__$/,'');c=c.replace(/<!--[\s\S]*-->/g,'');// Strip comments
	var f=_libraryParser2.default.parse(c);f.forEach(function(g){var h={};switch(g.content.forEach(function(i){return h[i.name]=i.content}),h.baseUrl=e,_this2.options.fileExtension&&(h.fileExtension=_this2.options.fileExtension),g.name){case'couple':// TODO: Create a new CoupleSound but push it into this.eventSounds
	break;case'event':_this2.eventSounds.push(new _eventSound2.default(b,h));break;case'heartbeat':_this2.heartbeatSounds.push(new _heartbeatSound2.default(b,h));break;case'state':_this2.stateSounds.push(new _stateSound2.default(b,h));break;default:console.warn('Unhandled __INDEX__ entry type '+g.name);}})}}]),a}();exports.default=a;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _audioResource=__webpack_require__(3),_audioResource2=_interopRequireDefault(_audioResource),_isound=__webpack_require__(6),_isound2=_interopRequireDefault(_isound),_mersenneTwister=__webpack_require__(5),_mersenneTwister2=_interopRequireDefault(_mersenneTwister),_utils=__webpack_require__(4),_utils2=_interopRequireDefault(_utils);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var a=function(_ISound){function a(b,c){_classCallCheck(this,a);var _this=_possibleConstructorReturn(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,b,c)),d=Math.max(1,parseInt(c.segments,10)||0),e=c.fileExtension||'',d=Math.max(1,parseInt(c.segments,10)||0),e=c.fileExtension||'';return _this.segments=Array.apply(null,Array(d)).map(function(f,g){// {baseUrl}{name}.{nn}{fileExtension}
	var h=`${c.baseUrl}${_this.name}.${_utils2.default.zeroPad(g+1,2)}${e}`;return new _audioResource2.default(b,h)}),_this.name=c.name,_this.segments=Array.apply(null,Array(d)).map(function(f,g){var h=`${c.baseUrl}${_this.name}.${_utils2.default.zeroPad(g+1,2)}${e}`;return new _audioResource2.default(b,h)}),_this}return _inherits(a,_ISound),_createClass(a,[{key:'load',value:function load(){this.segments.forEach(function(b){return b.load()})}},{key:'play',value:function play(){var b=0>=arguments.length||void 0===arguments[0]?0.5:arguments[0],c=1>=arguments.length||void 0===arguments[1]?0:arguments[1];console.log(`[EventSound] ${this.name} gain=${b} hash=${c}`);// Convert hash into a position in our unit cube world
	var d=new _mersenneTwister2.default(c),e={x:d.random()-0.5,y:0,z:d.random()-0.5},f=this.playableSegments();// Find all of the segments to play
	return f.length?void a.playOneShot(this.audioCtx,f,b,e):console.warn(`Did not play EventSound ${this.name}, no loaded segments`)}},{key:'playableSegments',value:function playableSegments(){return this.segments.filter(function(b){return b.audio})}}],[{key:'playOneShot',value:function playOneShot(b,c,d,e){var f=b.createPanner();f.refDistance=0.001,f.maxDistance=1,f.rolloffFactor=0.01,f.coneInnerAngle=360,f.setOrientation(0-e.x,0-e.y,0-e.z),f.setPosition(e.x,e.y,e.z);var g=b.createGain();g.gain.value=d,f.connect(g),g.connect(b.masterVolume);var h=b.currentTime;c.forEach(function(j){var k=b.createBufferSource();k.buffer=j.audio,k.connect(f),k.start(h),h+=j.audio.duration,k.stop(h)})}}]),a}(_isound2.default);exports.default=a;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _utils=__webpack_require__(4),_utils2=_interopRequireDefault(_utils);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}var a=function(){function a(b,c){_classCallCheck(this,a),this.audioCtx=b,this.url=c,this.loading=!1,this.audio=null}return _createClass(a,[{key:'load',value:function load(){var _this=this;if(!(this.loading||this.audio))return this.loading=!0,_utils2.default.request(this.url,'arraybuffer').then(function(b){return a.bufferToAudio(_this.audioCtx,b,_this.url)}).then(function(b){return _this.loading=!1,_this.audio=b,console.log(`Loaded ${_this.audio.duration.toFixed(2)} second clip from ${_this.url}`),_this.audio})}}],[{key:'bufferToAudio',value:function bufferToAudio(b,c,d){var e=!0;switch(_utils2.default.fileExtension(d)){case'.flac':case'.m4a':case'.mp3':case'.mp4':case'.oga':case'.ogg':case'.wav':e=!1;}if(e){var _ret=function(){var f=new Int16Array(c),g=new Float32Array(f.length);g.set(f),g.forEach(function(j,k){return g[k]=j/32767});var h=b.createBuffer(1,g.length,44100);return h.copyToChannel(g,0),{v:Promise.resolve(h)}}();if('object'==typeof _ret)return _ret.v}else return b.decodeAudioData(c)}}]),a}();exports.default=a;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _mersenneTwister=__webpack_require__(5),_mersenneTwister2=_interopRequireDefault(_mersenneTwister);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}var a=function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:'fileExtension',value:function fileExtension(b){var c=b.match(/\.[^.]+$/);return c?c[0]:void 0}},{key:'randomInt',value:function randomInt(b,c){return Math.floor(Math.random()*(c-b+1))+b}},{key:'request',value:function request(b,c){return new Promise(function(d,e){var f=new XMLHttpRequest;f.open('GET',b),f.responseType=c||'text',f.onload=function(){200<=this.status&&300>this.status?d(f.response):e({status:this.status,statusText:f.statusText})},f.onerror=function(){e({status:this.status,statusText:f.statusText})},f.send()})}},{key:'shuffled',value:function shuffled(b){b=b.slice(0);var c=void 0,d=void 0,e=void 0;for(e=b.length;e;e--)c=Math.floor(a.prng.random()*e),d=b[e-1],b[e-1]=b[c],b[c]=d;return b}},{key:'zeroPad',value:function zeroPad(b,c){for(b=''+b;b.length<c;)b='0'+b;return b}}]),a}();// Shared pseudo-random number generator
	exports.default=a;if(a.prng=new _mersenneTwister2.default,a.FADE_IN=new Float32Array(4096).map(function(a,b){return Math.cos(0.5*(1-b/4096)*Math.PI)}),a.FADE_OUT=new Float32Array(4096).map(function(a,b){return Math.cos(0.5*(b/4096)*Math.PI)}),Object.values=Object.values||function(b){var c=[];for(var d in b)c.push(b[d]);return c},'function'!=typeof window.CustomEvent){var _a=function _a(b,c){c=c||{bubbles:!1,cancelable:!1,detail:void 0};var d=document.createEvent('CustomEvent');return d.initCustomEvent(b,c.bubbles,c.cancelable,c.detail),d};_a.prototype=window.Event.prototype,window.CustomEvent=_a}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),a=function(){function a(b){for(_classCallCheck(this,a),void 0==b&&(b=new Date().getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=Array(this.N),this.mti=this.N+1,this.mt[0]=b>>>0,this.mti=1;this.mti<this.N;this.mti++){var c=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30;this.mt[this.mti]=(1812433253*((4294901760&c)>>>16)<<16)+1812433253*(65535&c)+this.mti,this.mt[this.mti]>>>=0}}return _createClass(a,[{key:"randomInt",value:function randomInt(){var b=void 0,c=[0,this.MATRIX_A];if(this.mti>=this.N){// generate N words at one time
	var d=void 0;for(d=0;d<this.N-this.M;d++)b=this.mt[d]&this.UPPER_MASK|this.mt[d+1]&this.LOWER_MASK,this.mt[d]=this.mt[d+this.M]^b>>>1^c[1&b];for(;d<this.N-1;d++)b=this.mt[d]&this.UPPER_MASK|this.mt[d+1]&this.LOWER_MASK,this.mt[d]=this.mt[d+(this.M-this.N)]^b>>>1^c[1&b];b=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^b>>>1^c[1&b],this.mti=0}return b=this.mt[this.mti++],b^=b>>>11,b^=2636928640&b<<7,b^=4022730752&b<<15,b^=b>>>18,b>>>0}},{key:"random",value:function random(){return this.randomInt()*(1/4294967296)}}]),a}();/**
	 * Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
	 * All rights reserved.
	 *
	 * Original JS port by Sean McCullough (banksean@gmail.com)
	 * ES6 port by John Hurliman (jhurliman@jhurliman.org)
	 */function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}exports.default=a;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),a=function(){function a(b,c){_classCallCheck(this,a),this.audioCtx=b,this.duration=+(c.length||'').split(' ').shift()||void 0,this.description=c.description,this.suggested=c.suggested}return _createClass(a,[{key:'load',value:function load(){}},{key:'play',value:function play(){var b=0>=arguments.length||void 0===arguments[0]?0.5:arguments[0],c=1>=arguments.length||void 0===arguments[1]?0:arguments[1]}}]),a}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}exports.default=a;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _isound=__webpack_require__(6),_isound2=_interopRequireDefault(_isound);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var a=function(_ISound){function a(b,c){return _classCallCheck(this,a),_possibleConstructorReturn(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,b,c))}return _inherits(a,_ISound),_createClass(a,[{key:'load',value:function load(){}},{key:'play',value:function play(){var b=0>=arguments.length||void 0===arguments[0]?0.5:arguments[0],c=1>=arguments.length||void 0===arguments[1]?0:arguments[1]}}]),a}(_isound2.default);exports.default=a;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _audioResource=__webpack_require__(3),_audioResource2=_interopRequireDefault(_audioResource),_isound=__webpack_require__(6),_isound2=_interopRequireDefault(_isound),_utils=__webpack_require__(4),_utils2=_interopRequireDefault(_utils);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var a=function(_ISound){function a(b,c){_classCallCheck(this,a);var _this=_possibleConstructorReturn(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,b,c)),d=Math.max(1,parseInt(c.segments,10)||0),e=c.fileExtension||'',d=Math.max(1,parseInt(c.segments,10)||0),e=c.fileExtension||'';// Create a shared gain node for this StateSound so we can adjust intensity
	// without touching fade-in / fade-out curves
	return _this.timer=null,_this.stateGain=b.createGain(),_this.stateGain.connect(b.masterVolume),_this.name=c.name,_this.segments=Array.apply(null,Array(d)).map(function(f,g){// {baseUrl}{name}.{nn}{fileExtension}
	var h=`${c.baseUrl}${_this.name}.${_utils2.default.zeroPad(g+1,2)}${e}`,j=new _audioResource2.default(b,h);return j.index=g,j}),_this.sources=[],_this.timer=null,_this}return _inherits(a,_ISound),_createClass(a,[{key:'load',value:function load(){this.segments.forEach(function(b){return b.load()})}},{key:'play',value:function play(){var b=0>=arguments.length||void 0===arguments[0]?0.5:arguments[0],c=1>=arguments.length||void 0===arguments[1]?0:arguments[1];console.log(`[StateSound] ${this.name} gain=${b} hash=${c}`),this.doPlay(b,c)}},{key:'doPlay',value:function doPlay(b,c){var _this2=this;for(// Remove already played segments
	var d=this.audioCtx.currentTime;this.sources.length&&this.sources[0].endTime<=d;)this.sources.shift();// Cancel and remove upcoming scheduled segments
	this.sources.slice(1).forEach(function(j){return j.stop(0)}),this.sources=this.sources.slice(0,1);var e=this.sources[0];if(!e){// No currently playing segment, find the next available
	var j=this.nextSegment();if(!j)return console.warn(`Did not play StateSound ${this.name}, no loaded segments`);e=this.playWithCrossfade(j,0,b),this.sources.push(e)}else if(this.stateGain.gain.value!==b){// Change the volume of the current playing segment
	var _j=this.stateGain.gain;_j.cancelScheduledValues(d),_j.setValueAtTime(_j.value,d),_j.linearRampToValueAtTime(b,d+a.VOLUME_CHANGE_TIME)}// Schedule the next segment for playback
	var f=this.nextSegment(),g=Math.max(0.1,e.endTime-d-a.FADE_TIME),h=this.playWithCrossfade(f,g,b);this.sources.push(h),clearTimeout(this.timer),this.timer=setTimeout(function(){_this2.doPlay(b,c)},1000*(e.endTime-d+0.1))}},{key:'nextSegment',value:function nextSegment(){var b=this.sources.length?this.sources[0].segment:void 0,c=_utils2.default.shuffled(this.segments),_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;// Prefer a segment that is not the current playing segment
	try{for(var _step,_iterator=c[Symbol.iterator]();!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){var d=_step.value;if(d!==b&&d.audio)return d}// Fall back to using the current segment, or undefined if there is none
	}catch(err){_didIteratorError=!0,_iteratorError=err}finally{try{!_iteratorNormalCompletion&&_iterator.return&&_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}return b}},{key:'playWithCrossfade',value:function playWithCrossfade(b,c,d){var e=this.audioCtx.currentTime,f=b.audio.duration,g=this.audioCtx.createBufferSource();g.buffer=b.audio;var h=e+c+f-a.FADE_TIME,j=this.audioCtx.createGain();return j.gain.setValueCurveAtTime(_utils2.default.FADE_IN,e+c,a.FADE_TIME),j.gain.setValueCurveAtTime(_utils2.default.FADE_OUT,h,a.FADE_TIME),g.connect(j),j.connect(this.stateGain),g.start(e+c),g.stop(e+c+f),g.segment=b,g.endTime=e+c+f,g}}]),a}(_isound2.default);exports.default=a;a.FADE_TIME=1,a.VOLUME_CHANGE_TIME=3;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:!0});/**
	 * PEG.js grammar:
	
	Elements =
	  elements:(Comment / Element / Text)* { return elements.filter(x => x); }
	
	Element =
	  startTag:StartTag content:SubContent endTag:EndTag {
	    return {
	      name: startTag,
	      content: content.filter(x => x)
	    };
	  }
	
	SubContent =
	  (SubElement / Text)*
	
	SubElement =
	  startTag:StartTag content:SubContent endTag:EndTag {
	    return {
	      name: startTag,
	      content: content[0]
	    };
	  }
	
	Comment =
	  "<!--" Text "-->"
	
	StartTag =
	  "<" name:TagName ">" { return name; }
	
	EndTag =
	  "</" name:TagName ">" { return name; }
	
	TagName = chars:[a-z]+ { return chars.join(""); }
	Text    = chars:[^<]+  { return chars.join("").trim(); }
	
	 */var LibraryParser=/*
	 * Generated by PEG.js 0.10.0.
	 *
	 * http://pegjs.org/
	 */function(){"use strict";function a(b,c,d,e){this.message=b,this.expected=c,this.found=d,this.location=e,this.name="SyntaxError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(this,a)}return function(c,d){function e(){this.constructor=c}e.prototype=d.prototype,c.prototype=new e}(a,Error),a.buildMessage=function(b,c){function d(k){return k.charCodeAt(0).toString(16).toUpperCase()}function e(k){return k.replace(/\\/g,"\\\\").replace(/"/g,"\\\"").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(l){return"\\x0"+d(l)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(l){return"\\x"+d(l)})}function f(k){return k.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(l){return"\\x0"+d(l)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(l){return"\\x"+d(l)})}function g(k){return h[k.type](k)}var h={literal:function literal(k){return"\""+e(k.text)+"\""},"class":function _class(k){var m,l="";for(m=0;m<k.parts.length;m++)l+=k.parts[m]instanceof Array?f(k.parts[m][0])+"-"+f(k.parts[m][1]):f(k.parts[m]);return"["+(k.inverted?"^":"")+l+"]"},any:function any(k){return"any character"},end:function end(k){return"end of input"},other:function other(k){return k.description}};return"Expected "+function(l){var n,o,m=Array(l.length);for(n=0;n<l.length;n++)m[n]=g(l[n]);if(m.sort(),0<m.length){for(n=1,o=1;n<m.length;n++)m[n-1]!==m[n]&&(m[o]=m[n],o++);m.length=o}switch(m.length){case 1:return m[0];case 2:return m[0]+" or "+m[1];default:return m.slice(0,-1).join(", ")+", or "+m[m.length-1];}}(b)+" but "+function(l){return l?"\""+e(l)+"\"":"end of input"}(c)+" found."},{SyntaxError:a,parse:function parse(c,d){function e(aa,ba){return{type:"literal",text:aa,ignoreCase:ba}}function f(aa,ba,ca){return{type:"class",parts:aa,inverted:ba,ignoreCase:ca}}function g(){return{type:"end"}}function h(aa){var ca,ba=X[aa];if(ba)return ba;for(ca=aa-1;!X[ca];)ca--;for(ba=X[ca],ba={line:ba.line,column:ba.column};ca<aa;)10===c.charCodeAt(ca)?(ba.line++,ba.column=1):ba.column++,ca++;return X[aa]=ba,ba}function k(aa,ba){var ca=h(aa),da=h(ba);return{start:{offset:aa,line:ca.line,column:ca.column},end:{offset:ba,line:da.line,column:da.column}}}function l(aa){V<Y||(V>Y&&(Y=V,Z=[]),Z.push(aa))}function m(aa,ba,ca){return new a(a.buildMessage(aa,ba),aa,ba,ca)}function n(){var aa,ba,ca;for(aa=V,ba=[],ca=t(),ca===z&&(ca=o(),ca===z&&(ca=y()));ca!==z;)ba.push(ca),ca=t(),ca===z&&(ca=o(),ca===z&&(ca=y()));return ba!==z&&(W=aa,ba=C(ba)),aa=ba,aa}function o(){var aa,ba,ca,da;return aa=V,ba=u(),ba===z?(V=aa,aa=z):(ca=q(),ca===z?(V=aa,aa=z):(da=v(),da===z?(V=aa,aa=z):(W=aa,ba=D(ba,ca,da),aa=ba))),aa}function q(){var aa,ba;for(aa=[],ba=r(),ba===z&&(ba=y());ba!==z;)aa.push(ba),ba=r(),ba===z&&(ba=y());return aa}function r(){var aa,ba,ca,da;return aa=V,ba=u(),ba===z?(V=aa,aa=z):(ca=q(),ca===z?(V=aa,aa=z):(da=v(),da===z?(V=aa,aa=z):(W=aa,ba=E(ba,ca,da),aa=ba))),aa}function t(){var aa,ba,ca,da;return aa=V,c.substr(V,4)===F?(ba=F,V+=4):(ba=z,l(G)),ba===z?(V=aa,aa=z):(ca=y(),ca===z?(V=aa,aa=z):(c.substr(V,3)===H?(da=H,V+=3):(da=z,l(I)),da===z?(V=aa,aa=z):(ba=[ba,ca,da],aa=ba))),aa}function u(){var aa,ba,ca,da;return aa=V,60===c.charCodeAt(V)?(ba="<",V++):(ba=z,l(J)),ba===z?(V=aa,aa=z):(ca=w(),ca===z?(V=aa,aa=z):(62===c.charCodeAt(V)?(da=K,V++):(da=z,l(L)),da===z?(V=aa,aa=z):(W=aa,ba=M(ca),aa=ba))),aa}function v(){var aa,ba,ca,da;return aa=V,c.substr(V,2)===N?(ba=N,V+=2):(ba=z,l(O)),ba===z?(V=aa,aa=z):(ca=w(),ca===z?(V=aa,aa=z):(62===c.charCodeAt(V)?(da=K,V++):(da=z,l(L)),da===z?(V=aa,aa=z):(W=aa,ba=M(ca),aa=ba))),aa}function w(){var aa,ba,ca;if(aa=V,ba=[],P.test(c.charAt(V))?(ca=c.charAt(V),V++):(ca=z,l(Q)),ca!==z)for(;ca!==z;)ba.push(ca),P.test(c.charAt(V))?(ca=c.charAt(V),V++):(ca=z,l(Q));else ba=z;return ba!==z&&(W=aa,ba=R(ba)),aa=ba,aa}function y(){var aa,ba,ca;if(aa=V,ba=[],S.test(c.charAt(V))?(ca=c.charAt(V),V++):(ca=z,l(T)),ca!==z)for(;ca!==z;)ba.push(ca),S.test(c.charAt(V))?(ca=c.charAt(V),V++):(ca=z,l(T));else ba=z;return ba!==z&&(W=aa,ba=U(ba)),aa=ba,aa}d=void 0===d?{}:d;var _,z={},A={Elements:n},B=n,C=function C(aa){return aa.filter(function(ba){return ba})},D=function D(aa,ba,ca){return{name:aa,content:ba.filter(function(da){return da})}},E=function E(aa,ba,ca){return{name:aa,content:ba[0]}},F="<!--",G=e("<!--",!1),H="-->",I=e("-->",!1),J=e("<",!1),K=">",L=e(">",!1),M=function M(aa){return aa},N="</",O=e("</",!1),P=/^[a-z]/,Q=f([["a","z"]],!1,!1),R=function R(aa){return aa.join("")},S=/^[^<]/,T=f(["<"],!0,!1),U=function U(aa){return aa.join("").trim()},V=0,W=0,X=[{line:1,column:1}],Y=0,Z=[],$=0;if("startRule"in d){if(!(d.startRule in A))throw new Error("Can't start parsing from rule \""+d.startRule+"\".");B=A[d.startRule]}if(_=B(),_!==z&&V===c.length)return _;throw _!==z&&V<c.length&&l(g()),m(Z,Y<c.length?c.charAt(Y):null,Y<c.length?k(Y,Y+1):k(Y,Y))}}}();exports.default=LibraryParser;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}();var _iauralizer=__webpack_require__(11),_iauralizer2=_interopRequireDefault(_iauralizer),_lruCache=__webpack_require__(12),_lruCache2=_interopRequireDefault(_lruCache),_signalType=__webpack_require__(13),_signalType2=_interopRequireDefault(_signalType),_utils=__webpack_require__(4),_utils2=_interopRequireDefault(_utils);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var a=function(_IAuralizer){function a(){return _classCallCheck(this,a),_possibleConstructorReturn(this,(a.__proto__||Object.getPrototypeOf(a)).apply(this,arguments))}return _inherits(a,_IAuralizer),_createClass(a,[{key:'start',value:function start(){var _this2=this;this.hn=firebase.initializeApp({databaseURL:'https://hacker-news.firebaseio.com'},'hackernews').database().ref('v0'),this.itemCache=new _lruCache2.default({capacity:1000}),this.topStories=null,this.bestStories=null,this.hn.child('newstories').on('value',function(c){var d=Date.now(),e=c.val();!e||!e.length||(_this2.signal(_signalType2.default.EVENT,'newstories',0.5,e[0]),_this2.getItems(e.slice(0,90)).then(function(f){var g=a.storiesPerHour(f,90,d),h=a.storiesPerHour(f,30,d);console.log(`[HN] ${h.toFixed(2)}/${g.toFixed(2)} stories per hour`),_this2.signal(_signalType2.default.STATE,'story-frequency',h/(2*g),f[0].time)}))}),this.hn.child('topstories').on('value',function(c){var d=c.val();!d||!d.length||(_this2.signal(_signalType2.default.EVENT,'topstories',0.5,d[0]),_this2.getItems(d.slice(0,30)).then(function(e){_this2.topStories=e,_this2.updateTrend()}))}),this.hn.child('beststories').on('value',function(c){var d=c.val();!d||!d.length||(_this2.signal(_signalType2.default.EVENT,'beststories',0.5,d[0]),_this2.getItems(d.slice(0,90)).then(function(e){_this2.bestStories=e,_this2.updateTrend()}))});var b=Date.now();this.hn.child('updates').on('value',function(c){// Track how much time passed between updates
	var d=Date.now(),e=d-b;b=d;var f=c.val().items;!f||!f.length||(_this2.signal(_signalType2.default.EVENT,'updates',0.5,f[0]),_this2.getItems(f).then(function(g){var h={jobs:[],stories:[],comments:[],polls:[]};g.forEach(function(k){switch(k.type){case'job':h.jobs.push(k);break;case'story':h.stories.push(k);break;case'comment':h.comments.push(k);break;case'poll':h.polls.push(k);break;default:}});var j=[];for(var k in h){var l=h[k];if(l.length){var _m='job'==k||'poll'==k?2:g.length;j.push({type:_signalType2.default.EVENT,signal:k,intensity:l.length/_m,hash:l.length})}}console.log(`[HN] ${h.jobs.length} jobs, ${h.stories.length} stories, `+`${h.comments.length} comments, ${h.polls.length} polls`),j.length&&_this2.signalOverTime(j,e)}))})}},{key:'updateTrend',value:function updateTrend(){var _this3=this;this.topStories&&this.bestStories&&function(){// Count the number of top stories that appear in the best stories list
	var b=new Set(_this3.bestStories.map(function(e){return e.id})),c=_this3.topStories.filter(function(e){return b.has(e.id)}).length;console.log(`[HN] ${c}/${_this3.topStories.length} front page stories appear in recent best`);// Full intensity if 1/3 or more of /topstories have made it to the last
	// few pages of /beststories
	var d=c/(_this3.topStories.length/3);_this3.signal(_signalType2.default.STATE,'popular-stories',d,c)}()}},{key:'getItems',value:function getItems(b){var _this4=this;return Promise.all(b.map(function(c){return _this4.getItem(c)}))// Retrieve all items in parallel
	.then(function(c){return c.filter(function(d){return d})});// Remove missing entries
	}},{key:'getItem',value:function getItem(b){var _this5=this;return new Promise(function(c,d){// Cache check
	var e=_this5.itemCache.fetch(b);return e?c(e):void _this5.hn.child('item/'+b).once('value',function(f){var g=f.val();_this5.itemCache.store(b,g),c(g)},function(f){d(f)});// Fetch from Firebase
	})}},{key:'signal',value:function signal(b,c,d){var e=3>=arguments.length||void 0===arguments[3]?0:arguments[3];this.callback&&this.callback(b,c,d,e)}},{key:'signalOverTime',value:function signalOverTime(b,c){var _this6=this;b=_utils2.default.shuffled(b);var d=c/b.length;b.forEach(function(e,f){var g=Math.max(0,d*f+_utils2.default.prng.random()*c-0.5*d);setTimeout(function(){return _this6.signal(e.type,e.signal,e.intensity,e.hash)},g)})}},{key:'eventSignals',get:function get(){return a.EVENTS}},{key:'heartbeatSignals',get:function get(){return a.HEARTBEATS}},{key:'stateSignals',get:function get(){return a.STATES}}],[{key:'storiesPerHour',value:function storiesPerHour(b,c,d){if(!b.length)return 0;var e=Math.min(c,b.length),f=1000*b[e-1].time;return e/((d-f)/3600000)}}]),a}(_iauralizer2.default);exports.default=a;a.EVENTS=['jobs','stories','comments','polls','topstories','beststories','newstories','updates'],a.HEARTBEATS=[],a.STATES=['story-frequency','popular-stories'];

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),a=function(){function a(){_classCallCheck(this,a)}return _createClass(a,[{key:"start",value:function start(){}},{key:"eventSignals",get:function get(){return[]}},{key:"heartbeatSignals",get:function get(){return[]}},{key:"stateSignals",get:function get(){return[]}/**
	   * @callback IAuralizer~signalHandler
	   * @param {SignalType} type - The type of signal. event, heartbeat, state.
	   * @param {string} signal - The identifier for this signal.
	   * @param {number} intensity - Normalized signal intensity, [0-1].
	   * @param {number} hash - An optional integer value tied to this unique event,
	   *   used for spatialization.
	   *//** @type {IAuralizer~signalHandler} */},{key:"signalHandler",set:function set(b){this.callback=b}}]),a}();/**
	 * IAuralizer is a base class for auralizers which connect to external data
	 * sources and emit signals that can be interpreted by the rest of the
	 * application.
	 */function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}exports.default=a;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),a=function(){function a(){var b=0>=arguments.length||void 0===arguments[0]?{}:arguments[0];_classCallCheck(this,a),this._map={},this._queue={},this._capacity=b.capacity||10,this._size=0}return _createClass(a,[{key:"store",value:function store(b,c){var d=this.delete(b),e=this._queue,f={value:c,key:b};return a.moveToLast(f,e),this._map[b]=f,this._size+=1,this._size>this._capacity&&this.delete(this._queue.first.key),d}},{key:"fetch",value:function fetch(b){var c=this._map[b];return void 0===c?void 0:(a.detachFromQueue(c,this._queue),a.moveToLast(c,this._queue),c.value)}},{key:"delete",value:function _delete(b){var c=this._map[b];return void 0!==c&&(a.detachFromQueue(c,this._queue),delete this._map[b],this._size-=1,!0)}}],[{key:"detachFromQueue",value:function detachFromQueue(b,c){b===c.first&&(c.first=b.next),b===c.last&&(c.last=b.prev),b.prev&&(b.prev.next=b.next),b.next&&(b.next.prev=b.prev)}},{key:"moveToLast",value:function moveToLast(b,c){b.prev=c.last,b.next=null,c.last&&(c.last.next=b),c.last=b,c.first||(c.first=b)}}]),a}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}exports.default=a;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});/**
	 * Enum for signal types an auralizer can emit.
	 * @readonly
	 * @enum {string}
	 */var SignalType={EVENT:'event',HEARTBEAT:'heartbeat',STATE:'state'};exports.default=SignalType;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _isignalMapper=__webpack_require__(15),_isignalMapper2=_interopRequireDefault(_isignalMapper),_utils=__webpack_require__(4),_utils2=_interopRequireDefault(_utils);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return call&&('object'==typeof call||'function'==typeof call)?call:self}function _inherits(subClass,superClass){if('function'!=typeof superClass&&null!==superClass)throw new TypeError('Super expression must either be null or a function, not '+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}var a=function(_ISignalMapper){function a(b,c){_classCallCheck(this,a);var _this=_possibleConstructorReturn(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,b,c)),d=_utils2.default.prng.randomInt(),e=_utils2.default.prng.randomInt(),f=_utils2.default.prng.randomInt(),d=_utils2.default.prng.randomInt(),e=_utils2.default.prng.randomInt(),f=_utils2.default.prng.randomInt();return b.stateSignals.forEach(function(g,h,j){_this.maps.state[g]=[c.stateSounds[(f+h)%c.stateSounds.length]]}),b.eventSignals.forEach(function(g,h,j){_this.maps.event[g]=[c.eventSounds[(d+h)%c.eventSounds.length]]}),b.heartbeatSignals.forEach(function(g,h,j){_this.maps.heartbeat[g]=[c.heartbeatSounds[(e+h)%c.heartbeatSounds.length]]}),b.stateSignals.forEach(function(g,h,j){_this.maps.state[g]=[c.stateSounds[(f+h)%c.stateSounds.length]]}),_this}return _inherits(a,_ISignalMapper),a}(_isignalMapper2.default);exports.default=a;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,'value'in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),a=function(){function a(b,c){_classCallCheck(this,a),this.auralizer=b,this.library=c,this.maps={event:{},heartbeat:{},state:{}},b.signalHandler=this.signalHandler.bind(this)}return _createClass(a,[{key:'startLoadAudio',value:function startLoadAudio(){Object.values(this.maps).forEach(function(b){Object.values(b).forEach(function(c){c.forEach(function(d){return d.load()})})})}},{key:'signalHandler',value:function signalHandler(b,c,d,e){var f=this.maps[b],g=f?f[c]:void 0;if(!g||!g.length)return console.warn(`Unmapped signal ${b}:${c}`);var h=g[e%g.length];d=Math.max(0,Math.min(1,d))||0,e=+e||0;// Broadcast an event
	var i=new CustomEvent('play-sound',{detail:{type:b,signal:c,intensity:d,hash:e}});document.dispatchEvent(i),h.play(d,e)}}]),a}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError('Cannot call a class as a function')}exports.default=a;

/***/ }
/******/ ]);
//# sourceMappingURL=webpeep.js.map