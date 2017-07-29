import loadCss from './components/require-css.js';
import loadJs from './components/require-js.js';
import {array_wrap} from './components/helpers.js';
import {parseURL} from './components/parseurl.js';
'use strict';
let _config = {
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
	let paths = {paths: Object.assign(_config.paths, opts.paths || {})};
	let dep   = {dep: Object.assign(_config.dep, opts.dep || {})};
	_config   = Object.assign(_config, opts, paths, dep);
	//删除空paths
	for (let key in _config.paths) {
		if (!_config.paths[key]) {
			console.log(_config.paths[key]);
			delete _config.paths[key];
		}
	}
	//删除空dep
	for (let key in _config.dep) {
		if (!_config.dep[key]) {
			delete _config.dep[key];
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
	names    = array_wrap(names);
	let name = names.shift();
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
	let url = toUrl(name);
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
	let url = _config.paths[name] || name;

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

RequireJC.config      = config;
RequireJC.loadJsOrCss = loadJsOrCss;
RequireJC.isJS        = isJS;
RequireJC.toUrl       = toUrl;
RequireJC.isEqualUrl  = isEqualUrl;
RequireJC.loadJs      = loadJs;
RequireJC.loadCss     = loadCss;
window.require        = window.RequireJC = window.requirejc = RequireJC;
