RequireJC
============
[![Build Status](https://travis-ci.org/hezhiying/requirejc.svg?branch=master)](https://travis-ci.org/hezhiying/requirejc)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)

一个非常宽松的依赖加载插件，本身也不依赖任何其它框架。对加载的JS没有特别的要求，只是直接地动态加载到网页中。非常适合做后台一类的项目，这些项目一般都会使用大量的外部jquery插件，而无需在首页一次性加载进来而是可以按需加载JS和CSS.

## 安装
> 1.安装或下载:https://github.com/hezhiying/requirejc.git
```bash
bower install hezhiying/requirejc
```
> 2.引入requirejc.js

```html
<script type="text/javascript" src="/bower_components/requirejc/requirejc.js"></script>

```
>

## 使用


```javascript
//全局配制
RequireJC.config({
    ver:'v0.0.1',//版本号会自动加在网址后面
    baseUrl:'/',
    debug  : false,
    paths:{
    	js1:'js1.js',
    	js2:'js2.js',
    	js4:'js4.js'
    },
    //js对应的依赖关系
    dep:{
    	js1:['js2','js1.css']
    },
    //全局映射所有依赖加载前先加载的插件
    map:['js4']
    
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

//其它方法
RequireJC.ver(ver);//设置或读取版本号
RequireJC.debug(debug);//设置或读取debug状态
RequireJC.addPath(name,path,dep);
RequireJC.toUrl(name); //获取实际加载的URL

```
## Features

- 支持JS和CSS.
- 支持相互依赖.
- 对加载的JS和CSS文件没有特别要求，宽松的加载（和html中script方式加载一样).
- 支持全局优先加载，所有插件加载前优先加载.
- 支持调试模式，调试模式下加载时不会有缓存.

## 构建
```bash
npm install
npm run dev  //生成requirejc.js
npm run prod //生成requirejc.min.js
#本地调试
npm run hot 

```
> 1.0分支使用gulp构建：[1.0-gulp](https://github.com/hezhiying/requirejc/tree/1.0-gulp)

## 预览

> http://localhost:8080/demo/

在chrome调试面板中可以直接调试

