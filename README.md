RequireJC
============

自动态加载js,css相关依赖文件

## 安装
> 1安装或下载:https://github.com/hezhiying/requirejc.git
```bash
bower install hezhiying/requirejc
```
>2引入requirejc.js

```html
	<script src="/bower_components/requirejc/require.js"></script>

```
>

## 使用


```javascript
//全局配制
require.config({
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
require(['js1','http://localhost/xxx.css'],function(){
	console.log('加载成功');
})

```

## 构建
```bash
npm install
gulp build
gulp pro
gulp watch

```
## 预览

> http://localhost:8000/demo/

在chrome调试面板中可以直接调试