RequireJC
============

自动态加载js,css相关依赖文件

## 使用


```javascript
//全局配制
require({
    baseUrl:'/',
    paths:{
    	js1:'js1.js',
    	js2:'js2.js'
    },
    dep:{
    	js1:['js2','js1.css']
    }
});

require('js1',function(){
	console.log('加载成功');
})


```