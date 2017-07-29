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
	var a =  document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':',''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function(){
			var ret = {},
				seg = a.search.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [undefined,''])[1],
		hash: a.hash.replace('#',''),
		path: a.pathname.replace(/^([^\/])/,'/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [undefined,''])[1],
		segments: a.pathname.replace(/^\//,'').split('/')
	};
}