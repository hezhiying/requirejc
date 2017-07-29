/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_require_css_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_require_js_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_helpers_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_parseurl_js__ = __webpack_require__(5);




'use strict';
var _config = {
	ver: '0.0.1', baseUrl: '', paths: {}, dep: {}
};

/**
 * 修改配制参数
 * @param opts
 */
function config(opts) {
	if ('undefined' === typeof opts) {
		return _config;
	}
	var paths = { paths: Object.assign(_config.paths, opts.paths || {}) };
	var dep = { dep: Object.assign(_config.dep, opts.dep || {}) };
	_config = Object.assign(_config, opts, paths, dep);
	//删除空paths
	for (var key in _config.paths) {
		if (!_config.paths[key]) {
			console.log(_config.paths[key]);
			delete _config.paths[key];
		}
	}
	//删除空dep
	for (var _key in _config.dep) {
		if (!_config.dep[_key]) {
			delete _config.dep[_key];
		}
	}
}

/**
 * 入口函数
 * @param names
 * @param func
 * @returns {*}
 * @constructor
 */
function RequireJC(names, func) {
	if ('undefined' === typeof names) {
		console.error("必须传入要加载依赖数组.\nexample:RequireJC(['js1','js2'],function(){})");
		return;
	}
	names = Object(__WEBPACK_IMPORTED_MODULE_2__components_helpers_js__["a" /* array_wrap */])(names);
	var name = names.shift();
	if ('undefined' === typeof name) {
		if ('function' === typeof func) {
			return func();
		}
		console.log('没有callback方法');
		return;
	}

	if (hasDep(name)) {
		RequireJC(getDep(name), function () {
			loadJsOrCss(name, function () {
				return RequireJC(names, func);
			});
		});
	} else {
		loadJsOrCss(name, function () {
			return RequireJC(names, func);
		});
	}
}

/**
 * 加载单个脚本或样式
 * @param name
 * @param func
 * @returns {*}
 */
function loadJsOrCss(name, func) {
	var url = toUrl(name);
	if (isJS(name)) {
		return RequireJC.loadJs(urlArgs(url), func);
	} else {
		return RequireJC.loadCss(urlArgs(url), func);
	}
}

/**
 * 脚本插件是否有其它依赖
 * @param name
 * @returns {boolean}
 */
function hasDep(name) {
	return 'undefined' !== typeof _config.dep[name];
}

/**
 * 获取脚本的依赖信息
 * @param name
 * @returns {Array}
 */
function getDep(name) {
	return hasDep(name) ? _config.dep[name] : [];
}

/**
 * 处理URL后缀
 * @param url
 * @returns {string}
 */
function urlArgs(url) {
	return url + '?ver=' + _config.ver;
}

/**
 * 添加指定依赖关系
 * @param name
 * @param path
 * @param dep
 */
function addPath(name, path, dep) {
	if (path) {
		_config.paths[name] = path;
	}
	if (dep) {
		_config.dep[name] = dep;
	}
}

/**
 * 确定给定的两个URL是否相同
 * @param url1
 * @param url2
 * @returns {boolean}
 */
function isEqualUrl(url1, url2) {
	return Object(__WEBPACK_IMPORTED_MODULE_3__components_parseurl_js__["a" /* parseURL */])(url1).relative === Object(__WEBPACK_IMPORTED_MODULE_3__components_parseurl_js__["a" /* parseURL */])(url2).relative;
}

/**
 * 确认是否JS文件
 * @param name
 * @returns {boolean}
 */
function isJS(name) {
	return toUrl(name).substr(-3) === '.js';
}

/**
 * 返回最终脚本文件路径
 * @param name
 * @returns {*}
 */
function toUrl(name) {
	var url = _config.paths[name] || name;

	if (url.substr(0, 4) === 'css!') {
		url = url.substr(4);
		if (url.substr(-4) !== ".css") {
			url = url + ".css";
		}
	}

	if (url.substr(-3) !== ".js" && url.substr(-4) !== ".css") {
		url = url + ".js";
	}

	if (/^http|^https|^\//.test(url)) {
		return url;
	} else {
		return _config.baseUrl + url;
	}
}

RequireJC.config = config;
RequireJC.loadJsOrCss = loadJsOrCss;
RequireJC.isJS = isJS;
RequireJC.toUrl = toUrl;
RequireJC.isEqualUrl = isEqualUrl;
RequireJC.loadJs = __WEBPACK_IMPORTED_MODULE_1__components_require_js_js__["a" /* default */];
RequireJC.loadCss = __WEBPACK_IMPORTED_MODULE_0__components_require_css_js__["a" /* default */];
window.require = window.RequireJC = window.requirejc = RequireJC;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var head = document.getElementsByTagName('head')[0];

var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0;

// use <style> @import load method (IE < 9, Firefox < 18)
var useImportLoad = false;

// set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
var useOnload = true;

// trident / msie
if (engine[1] || engine[7]) useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
// webkit
else if (engine[2] || engine[8] || 'WebkitAppearance' in document.documentElement.style) useOnload = false;
	// gecko
	else if (engine[4]) useImportLoad = parseInt(engine[4]) < 18;

//>>excludeEnd('excludeRequireCss')
//main api object
var cssAPI = {};

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
//cssAPI.pluginBuilder = './css-builder';

// <style> @import load method
var curStyle, curSheet;
var createStyle = function createStyle() {
	curStyle = document.createElement('style');
	head.appendChild(curStyle);
	curSheet = curStyle.styleSheet || curStyle.sheet;
};
var ieCnt = 0;
var ieLoads = [];
var ieCurCallback;

var createIeLoad = function createIeLoad(url) {
	curSheet.addImport(url);
	curStyle.onload = function () {
		processIeLoad();
	};

	ieCnt++;
	if (ieCnt === 31) {
		createStyle();
		ieCnt = 0;
	}
};
var processIeLoad = function processIeLoad() {
	ieCurCallback();

	var nextLoad = ieLoads.shift();

	if (!nextLoad) {
		ieCurCallback = null;
		return;
	}

	ieCurCallback = nextLoad[1];
	createIeLoad(nextLoad[0]);
};
var importLoad = function importLoad(url, callback) {
	if (!curSheet || !curSheet.addImport) createStyle();

	if (curSheet && curSheet.addImport) {
		// old IE
		if (ieCurCallback) {
			ieLoads.push([url, callback]);
		} else {
			createIeLoad(url);
			ieCurCallback = callback;
		}
	} else {
		// old Firefox
		curStyle.textContent = '@import "' + url + '";';

		var loadInterval = setInterval(function () {
			try {
				var cssRules = curStyle.sheet.cssRules;
				clearInterval(loadInterval);
				callback();
			} catch (e) {}
		}, 10);
	}
};

// <link> load method
var linkLoad = function linkLoad(url, callback) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	if (useOnload) link.onload = function () {
		link.onload = function () {};
		// for style dimensions queries, a short delay can still be necessary
		setTimeout(callback, 7);
	};else var loadInterval = setInterval(function () {
		for (var i = 0; i < document.styleSheets.length; i++) {
			var sheet = document.styleSheets[i];
			if (sheet.href == link.href) {
				clearInterval(loadInterval);
				return callback();
			}
		}
	}, 10);
	link.href = url;
	head.appendChild(link);
};

//>>excludeEnd('excludeRequireCss')
cssAPI.normalize = function (name, normalize) {
	if (name.substr(name.length - 4, 4) === '.css') name = name.substr(0, name.length - 4);

	return normalize(name);
};

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
function loadCss(url, load) {

	(useImportLoad ? importLoad : linkLoad)(url, load);
};
/* harmony default export */ __webpack_exports__["a"] = (loadCss);
//requirejc.loadCss = cssAPI.load;
//export default cssAPI.load;
//cssAPI.load('/bower_components/bootstrap-daterangepicker/daterangepicker.css','succ');
//>>excludeEnd('excludeRequireCss')

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*jshint esversion: 6 */
function loadJs(src, func) {
	//判断这个js文件存在直接执行回调
	var scripts = document.getElementsByTagName('script');
	for (var i in scripts) {
		if (requirejc.isEqualUrl(scripts[i].src, src)) return func();
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;
	var head = document.getElementsByTagName('head').item(0);
	head.appendChild(script);

	script.onload = function () {
		if ('function' === typeof func) {
			func();
		}
	};
}
/* harmony default export */ __webpack_exports__["a"] = (loadJs);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = array_wrap;
/**
 * 如果给定的值不是数组，则将其包装在一个数组中
 * @param name
 * @returns {[*]}
 */
function array_wrap(name) {
  return 'string' === typeof name ? [name] : name;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parseURL;
/**
 *@param {string} url 完整的URL地址
 *@returns {object} 自定义的对象
 *@description 用法示例：var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
 myURL.file='index.html'

 myURL.hash= 'top'

 myURL.host= 'abc.com'

 myURL.query= '?id=255&m=hello'

 myURL.params= Object = { id: 255, m: hello }

 myURL.path= '/dir/index.html'

 myURL.segments= Array = ['dir', 'index.html']

 myURL.port= '8080'

 myURL.protocol= 'http'

 myURL.source= 'http://abc.com:8080/dir/index.html?id=255&m=hello#top'

 */
function parseURL(url) {
	var a = document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':', ''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: function () {
			var ret = {},
			    seg = a.search.replace(/^\?/, '').split('&'),
			    len = seg.length,
			    i = 0,
			    s;
			for (; i < len; i++) {
				if (!seg[i]) {
					continue;
				}
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		}(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [undefined, ''])[1],
		hash: a.hash.replace('#', ''),
		path: a.pathname.replace(/^([^\/])/, '/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [undefined, ''])[1],
		segments: a.pathname.replace(/^\//, '').split('/')
	};
}

/***/ })
/******/ ]);