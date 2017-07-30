import {isEqualUrl} from './helpers';

let head = document.getElementsByTagName('head')[0];

let engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0;

// use <style> @import load method (IE < 9, Firefox < 18)
let useImportLoad = false;

// set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
let useOnload = true;

// trident / msie
if (engine[1] || engine[7])
	useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
// webkit
else if (engine[2] || engine[8] || 'WebkitAppearance' in document.documentElement.style)
	useOnload = false;
// gecko
else if (engine[4])
	useImportLoad = parseInt(engine[4]) < 18;

//>>excludeEnd('excludeRequireCss')
//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
//cssAPI.pluginBuilder = './css-builder';

// <style> @import load method
let curStyle, curSheet;
let createStyle = function () {
	curStyle = document.createElement('style');
	head.appendChild(curStyle);
	curSheet = curStyle.styleSheet || curStyle.sheet;
};
let ieCnt       = 0;
let ieLoads     = [];
let ieCurCallback;

let createIeLoad  = function (url) {
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
let processIeLoad = function () {
	ieCurCallback();

	let nextLoad = ieLoads.shift();

	if (!nextLoad) {
		ieCurCallback = null;
		return;
	}

	ieCurCallback = nextLoad[1];
	createIeLoad(nextLoad[0]);
};
let importLoad    = function (url, callback) {
	if (!curSheet || !curSheet.addImport)
		createStyle();

	if (curSheet && curSheet.addImport) {
		// old IE
		if (ieCurCallback) {
			ieLoads.push([url, callback]);
		}
		else {
			createIeLoad(url);
			ieCurCallback = callback;
		}
	}
	else {
		// old Firefox
		curStyle.textContent = '@import "' + url + '";';

		let loadInterval = setInterval(function () {
			try {
				let cssRules = curStyle.sheet.cssRules;
				clearInterval(loadInterval);
				callback();
			} catch (e) {
			}
		}, 10);
	}
};

// <link> load method
let linkLoad = function (url, callback) {
	let links = document.getElementsByTagName('link');
	for (let link in links) {
		if (links.hasOwnProperty(link) && isEqualUrl(links[link].href, url))
			return callback();
	}
	let link  = document.createElement('link');
	link.type = 'text/css';
	link.rel  = 'stylesheet';
	if (useOnload) {
		link.onload = function () {
			link.onload = function () {
			};
			// for style dimensions queries, a short delay can still be necessary
			setTimeout(callback, 7);
		};
	}
	else {
		let loadInterval = setInterval(function () {
			for (let i = 0; i < document.styleSheets.length; i++) {
				let sheet = document.styleSheets[i];
				if (sheet.href === link.href) {
					clearInterval(loadInterval);
					return callback();
				}
			}
		}, 10);
	}

	link.href = url;
	head.appendChild(link);
};

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
//入口
export default function loadCss(url, load) {

	(useImportLoad ? importLoad : linkLoad)(url, load);

}
//>>excludeEnd('excludeRequireCss')
