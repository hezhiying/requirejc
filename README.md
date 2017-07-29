RequireJC
============

动态加载js,css相关依赖文件

## 安装
> 1.安装或下载:https://github.com/hezhiying/requirejc.git
```bash
bower install hezhiying/requirejc
```
> 2.引入requirejc.js

```html
	<script type="text/javascript" src="/bower_components/requirejc/require.js"></script>

```
>

## 使用


```javascript
//全局配制
RequireJC.config({
    baseUrl:'/',
    paths:{
    	js1:'js1.js',
    	js2:'js2.js'
    },
    //js对应的依赖关系
    dep:{
    	js1:['js2','js1.css']
    }
});

//获取配制
let config = RequireJC.config();

//使用
RequireJC('js1',function(){
	console.log('加载成功');
})
RequireJC(['js1','http://localhost/xxx.css'],function(){
	console.log('加载成功');
})

```

## 构建
```bash
npm install
npm run dev  //生成require.js
npm run prod //生成require.min.js
#本地调试
npm run hot 

```
> 1.0分支使用gulp构建：[1.0-gulp](https://github.com/hezhiying/requirejc/tree/1.0-gulp)

## 预览

> http://localhost:8080/demo/

在chrome调试面板中可以直接调试