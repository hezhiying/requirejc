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
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var requireObj = {};

requireObj.config = {
	ver: '0.0.1',
	baseUrl: '/test/',
	paths: {
		js1: 'js1',
		js2: 'js2.js',
		js3: 'js3.js',
		daterangepicker: '/bower_components/bootstrap-daterangepicker/daterangepicker.js',
		moment: '/bower_components/moment/moment.js'
	},
	dep: {
		js1: ['js2', 'css!js1'],
		js2: ['js3'],
		daterangepicker: ['moment', '/bower_components/bootstrap-daterangepicker/daterangepicker.css']
	}
};

requireObj.urlArgs = function (url) {
	return url + '?ver=0.0.1';
};

requireObj.addPath = function (name, path, dep) {
	if (path) {
		requireObj.config.paths[name] = path;
	}
	if (dep) {
		requireObj.config.dep[name] = dep;
	}
};
requireObj.hasDep = function (name) {
	return 'undefined' !== typeof requireObj.config.dep[name];
};
requireObj.getDep = function (name) {
	return requireObj.config.dep[name];
};

requireObj.load = function (name, func) {
	var url = requireObj.toUrl(name);
	if (requireObj.isJS(name)) {
		return requireObj.loadJs(requireObj.urlArgs(url), func);
	} else {
		return requireObj.loadCss(requireObj.urlArgs(url), func);
	}
};

/**
 * 确认是否JS文件
 * @param name
 * @returns {boolean}
 */
requireObj.isJS = function (name) {
	return requireObj.toUrl(name).substr(-3) === '.js';
};

/**
 * 返回最终脚本文件路径
 * @param name
 * @returns {*}
 */
requireObj.toUrl = function (name) {
	var url = requireObj.config.paths[name] || name;

	if (url.substr(0, 4) === 'css!') {
		url = url.substr(4);
		if (url.substr(-4) !== ".css") {
			url = url + ".css";
		}
	}

	if (url.substr(-3) !== ".js" && url.substr(-4) !== ".css") {
		url = url + ".js";
	}

	if (/^http|^https|\//.test(url)) {
		return url;
	} else {
		return requireObj.config.baseUrl + url;
	}
};

window.require = function (names, func) {
	if ((typeof names === 'undefined' ? 'undefined' : _typeof(names)) === 'object' && isNaN(names.length)) {
		return Object.assign(requireObj.config, names);
	}

	if ('string' === typeof names) {
		names = [names];
	}
	var name = names.shift();
	if ('undefined' === typeof name) {
		return func();
	}
	if (requireObj.hasDep(name)) {
		require(requireObj.getDep(name), function () {
			requireObj.load(name, function () {
				return require(names, func);
			});
		});
	} else {
		requireObj.load(name, function () {
			return require(names, func);
		});
	}
};
requireObj.isEqualUrl = function (url1, url2) {
	return parseURL(url1).relative === parseURL(url2).relative;
};
requireObj.loadJs = function (src, func) {
	//判断这个js文件存在直接执行回调
	var scripts = document.getElementsByTagName('script');
	for (var i in scripts) {
		if (this.isEqualUrl(scripts[i].src, src)) return func();
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

requireObj.loadCss = cssAPI.load;

//cssAPI.load('/bower_components/bootstrap-daterangepicker/daterangepicker.css','succ');

//>>excludeEnd('excludeRequireCss')