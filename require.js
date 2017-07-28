var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (global, factory) {
	(typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.require = global.RequireJC = global.requirejc = factory();
})(undefined || window, function () {
	'use strict';

	var _config = {
		ver: '0.0.1', baseUrl: '', paths: {}, dep: {}
	};

	/**
  * 修改配制参数
  * @param opts
  */
	function config(opts) {
		//Todo::可以进一步完善，实现path和dep有则修改，无则添加，并且不会影响原有配制参数
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
		names = array_wrap(names);
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
		return parseURL(url1).relative === parseURL(url2).relative;
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
	return RequireJC;
});
/**
 * 如果给定的值不是数组，则将其包装在一个数组中
 * @param name
 * @returns {[*]}
 */
function array_wrap(name) {
  return 'string' === typeof name ? [name] : name;
}
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
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
		hash: a.hash.replace('#', ''),
		path: a.pathname.replace(/^([^\/])/, '/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
		segments: a.pathname.replace(/^\//, '').split('/')
	};
}
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
	if (ieCnt == 31) {
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
				curStyle.sheet.cssRules;
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
cssAPI.load = function (url, load) {

	(useImportLoad ? importLoad : linkLoad)(url, load);
};

requirejc.loadCss = cssAPI.load;

//cssAPI.load('/bower_components/bootstrap-daterangepicker/daterangepicker.css','succ');

//>>excludeEnd('excludeRequireCss')
requirejc.loadJs = function (src, func) {
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
};