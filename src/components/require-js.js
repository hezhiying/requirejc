import {isEqualUrl} from './helpers';

/*jshint esversion: 6 */
//入口
export default function loadJs(src,func) {
	//判断这个js文件存在直接执行回调
	let scripts = document.getElementsByTagName('script') ;
	for(let i in scripts){
		if(scripts.hasOwnProperty(i) && isEqualUrl(scripts[i].src,src))
			return func();
	}
	let script = document.createElement('script') ;
	script.type ='text/javascript' ;
	script.src = src ;
	let head = document.getElementsByTagName('head').item(0);
	head.appendChild(script);

	script.onload = function(){
		if('function' === typeof func){
			func();
		}
	};
}