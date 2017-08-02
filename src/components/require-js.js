import {isEqualUrl} from './helpers';
function callback(func) {

}
/*jshint esversion: 6 */
//入口
export default function loadJs(src, func) {
	//判断这个js文件存在直接执行回调
	let scripts = document.getElementsByTagName('script');
	for (let i in scripts) {
		if (scripts.hasOwnProperty(i) && isEqualUrl(scripts[i].src, src)) {
			if (scripts[i].dataset.isLoad) {
				return func();
			} else {
				//如果脚本还没有加载完全，后续脚本将等待最多10秒
				let times = 0;
				let ttl   = 10000;
				let stop  = setInterval(function () {
					times++;
					if (scripts[i].dataset.isLoad) {
						clearTimeout(stop);
						return func();
					}
					if (times * 200 >= ttl) {
						clearTimeout(stop);
						throw new Error("脚本加载超时:[" + (times * 200) + "ms] Script:[" + scripts[i].src + "]");
					}
				}, 200);
				return;
			}
		}
	}
	let script  = document.createElement('script');
	script.type = 'text/javascript';
	script.src  = src;
	let head    = document.getElementsByTagName('head').item(0);
	head.appendChild(script);

	script.onload = function () {
		//标记脚本已加载
		script.dataset.isLoad = true;
		if ('function' === typeof func) {
			func();
		}
	};
}