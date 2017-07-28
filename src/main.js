const requireObj = {};

requireObj.config = {
	ver    : '0.0.1',
	baseUrl: '/test/',
	paths: {
		js1:'js1',
		js2:'js2.js',
		js3:'js3.js',
		daterangepicker:'/bower_components/bootstrap-daterangepicker/daterangepicker.js',
		moment:'/bower_components/moment/moment.js'
	},
	dep  : {
		js1:['js2','css!js1'],
		js2:['js3'],
		daterangepicker:['moment','/bower_components/bootstrap-daterangepicker/daterangepicker.css']
	}
};

requireObj.urlArgs = function (url) {
	return url+'?ver=0.0.1'
};

requireObj.addPath = function (name,path,dep) {
	if(path){
		requireObj.config.paths[name] = path;
	}
	if(dep){
		requireObj.config.dep[name] = dep;
	}
};
requireObj.hasDep = function (name) {
	return 'undefined' !== typeof requireObj.config.dep[name]
};
requireObj.getDep = function (name) {
	return requireObj.config.dep[name];
};

requireObj.load =function (name,func) {
	let url = requireObj.toUrl(name);
	if(requireObj.isJS(name)){
		return requireObj.loadJs(requireObj.urlArgs(url),func);
	}else{
		return requireObj.loadCss(requireObj.urlArgs(url),func);
	}
};

/**
 * 确认是否JS文件
 * @param name
 * @returns {boolean}
 */
requireObj.isJS = function (name) {
	return requireObj.toUrl(name).substr(-3) === '.js'
};

/**
 * 返回最终脚本文件路径
 * @param name
 * @returns {*}
 */
requireObj.toUrl = function(name){
	let url = requireObj.config.paths[name] || name;

	if(url.substr(0, 4) === 'css!'){
		url = url.substr(4);
		if(url.substr(-4) !== ".css"){
			url = url+".css";
		}
	}

	if(url.substr(-3) !== ".js" && url.substr(-4) !== ".css"){
		url = url+".js";
	}

	if(/^http|^https|\//.test(url)){
		return url;
	}else{
		return requireObj.config.baseUrl+url;
	}

};

window.require = function(names, func){
	if(typeof names === 'object' && isNaN(names.length)){
		return Object.assign(requireObj.config, names);
	}

	if('string' === typeof names){
		names = [names];
	}
	let name = names.shift();
	if('undefined' === typeof name){
		return func();
	}
	if(requireObj.hasDep(name)){
		require(requireObj.getDep(name),function(){
			requireObj.load(name,function(){
				return require(names,func)
			})
		})
	}else{
		requireObj.load(name,function(){
			return require(names,func)
		})
	}

};