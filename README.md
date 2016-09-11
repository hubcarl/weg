#weg

基于fis3+swig的前端和后端集成解决方案。在阅读此文档之前，希望你最好对fis3、swig、express 、mysql有一定的了解。

weg模块化解决方案通过自定义相关插件解决了fis3以下问题：

1. 插件weg-command-server 解决了fis3的默认server不自动安装package.json依赖问题.
2. 插件weg-command-server 解决了fis3不能指定node启动入口文件，weg server start --entry app.js.
3. 插件weg-command-server 支持控制台或者命令行显示log日志功能.
4. 插件weg-command-server 支持了监听服务器文件修改自动重启node server的功能.
5. 支持多项目release目录隔离,解决fis多个项目release到同一目录问题.
6. weg-swig插件通过标签支持模板继承和模块化加载[widget](http://codehelp.cn/blog/2016/03/19/weg-swig-widget/).
7. 插件weg-swig插件支持模块chunk加载和lazy加载，以及[pagelet模式](http://codehelp.cn/blog/2016/03/13/weg-swig-pagelet/).
8. weg结合express/swig/es6, 提供一套完整的前后端解决方案，并提供解决方案脚手架[weg-blog](https://github.com/hubcarl/weg).
9. 提供自定义中间件解决 [根据配置文件自动注册注册中间件](https://github.com/hubcarl/express-use-middleware)和[遍历指定目录自动注册路由](https://github.com/hubcarl/express-router-middleware)


#weg-blog

基于weg+express+swig的前端和后端集成解决方案工程示例。


## 目录

* [特点](#特点)
* [快速开始](#快速开始)
* [目录规范](#目录规范)
 - [client 目录](#前端)
    - [public 目录](#page-目录)
        - [component 目录](#组件)
        - [framework 目录](#组件,不会被cmd)
        - [static 目录](#css／js／image公共静态资源)
    - [views 目录](#static-目录)
      - [page 目录](#页面模板)
      - [widget 目录](#组件)
 - [server 目录](#后端)
    - [config 目录](#服务器配置)
    - [controller 目录](#路由)
    - [lib 目录](#第三发组件或者组件扩展)
    - [middleware 目录](#中间件)
    - [model 目录](＃数据模型)
    - [utils 目录](＃工具类)
 - [fis-conf.js](#fis配置文件)
 - [server.js](#express启动入口, weg默认启动文件,自定义:weg server start --entry app.js)

## 特点

* 基于原生fis3前端集成方案对前端资源进行打包，相比自定义fis扩展，方便fis组件升级和维护。
* 整合前端和node.js后端，提供一套express + swig骨架，并提供基于mysql的运行实例. 服务器支持路由,中间件自动注册, 同时引入coexpress 解决异步回调问题, 支持es6 yield语法.  拿来即可使用，扩展也很方便。
* 模板引擎采用 [swig](http://paularmstrong.github.io/swig/) ，提供易用的 `html`、`head`、`body`、`pagelet`、`widget`、`script`、`style` 等扩展标签。基于这些标签后端可以自动完成对页面的性能优化。
* 基于 `widget` 标签，可以轻松实现组件化，同名tpl、 css、js自动关联加载。


## 示例截图

 ![image](https://raw.githubusercontent.com/hubcarl/weg-blog/master/client/public/static/images/demo.png)


## 快速开始

如果还没有安装 [node](http://nodejs.org) 请先安装 [node](http://nodejs.org).

```bash
# 安装 fis 到全局
npm install -g weg

# 下载工程.
git clone https://github.com/hubcarl/weg-blog.git


# 进入 weg-blog  目录， release 后就可以预览了。
cd weg-blog


#工程运行
weg release -w 文件修改监控
weg server start  默认入口文件为server.js  自定义入口文件需要指定entry参数(weg server start --entry app.js)
```

### page 目录

所有页面级别的模板文件，放在此目录。此tpl 可以直接在浏览器中预览。比如 page/index.tpl 可以通过 http://127.0.0.1:9000 访问。 需要强调的的是，模板引擎采用的是 [swig](http://paularmstrong.github.io/swig/), 可以采用模板继承机制来实现模板复用。

layout.tpl

```tpl
<!doctype html>
{% html lang="en" framework="public/static/js/mod.js"  %}
    {% head %}
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="/static/favicon.ico">
        <title>{{ title }}</title>

        {% require "public/static/css/normalize.css" %}
        {% require "public/static/css/bootstrap.css" %}
        {% require "public/static/css/app.css" %}


    {% endhead %}

    {% body %}

        {% widget "widget/menu/menu.tpl" %}


            {% block beforecontent %}
            {% endblock %}

            <div class="container">
                {% block content %}
                {% endblock %}
            </div>
    
        {% block aftercontent %}
        {% endblock %}
    
    {% endbody %}

{% endhtml %}

```

news/index/index.tpl

```tpl
{% extends 'page/layout.tpl' %}

{% block content %}

<div class="container smart-container">
    <div class="row row-offcanvas row-offcanvas-right">
        <div class="col-xs-12 col-sm-9">
            <ul class="smart-artiles" id="articleList">
                {% for item in list %}
                <li>
                    <div class="point">+{{item.hits}}</div>
                    <div class="card">
                        <h2><a href="/detail/{{item.id}}" target="_blank">{{item.title}}</a></h2>
                        <div>
                            <ul class="actions">
                                <li>
                                    <time class="timeago">{{item.createDate}}</time>
                                </li>
                                <li class="tauthor">
                                    <a href="#" target="_blank" class="get">Sky</a>
                                </li>
                                <li><a href="#" class="kblink-8007">+收藏</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                {% endfor %}
            </ul>
            <div id="pagerBottom" class="smart-pager"></div>
        </div>
    </div>
</div>

{% require "client/views/page/news/index/index.js" %}

{% script %}
    // 支持相对路径
    require('./index.js');
{% endscript %}


{% endblock %}

```

### static 目录

用来存放所有静态资源文件，css, js, images ,组件等等。如：

```
├── css
│   ├── bootstrap-theme.css
│   ├── bootstrap.css
│   └── style.css
└── js
    ├── bootstrap.js
    └── mod.js
```

### widget 目录

用来存放各类组件代码。组件分成3类。

1. 模板类：包含 tpl, 可以选择性的添加 js 和 css 文件，同名的 js 和 css 会被自动加载。

  模板类文件，可以在模板中通过 widget 标签引用。如

  ```tpl
  {% widget "widget/menu/menu.tpl" %}
  ```
2. js 类： 主要包含 js 文件，放在此目录下的文件一般都会自动被 amd define 包裹，可选择性的添加同名 css 文件，会自动被引用。

  此类组件，可以在 tpl 或者 js 中通过 require 标签引用。

  ```tpl
  
    {% require "client/views/page/news/index/index.js" %}

    {% script %}
        console.log('>>>>test>>>>>');
        require('client/views/page/news/index/index.js');
    {% endscript %}

  ```
3. 纯 css 类：只是包含 css 文件。比如 compass. 同样也是可以通过 require 标签引用。

## BigPipe+Pagelet

采用 bigpipe 方案，允许你在渲染页面的时候，提前将框架输出，后续再把耗时的 pagelet 通过 chunk 方式输出到页面，以加速网页渲染。

- sync 默认就是此模式，直接输出。
- quicking 此类 widget 在输出时，只会输出个壳子，内容由用户自行决定通过 js，另起请求完成填充，包括静态资源加载。
- async 此类 widget 在输出时，也只会输出个壳子，但是内容在 body 输出完后，chunk 输出 js 自动填充。widget 将忽略顺序，谁先准备好，谁先输出。
- pipeline 与 async 基本相同，只是它会严格按顺序输出。

  {% widget "widget/header/header.html" mode="pipeline" id="header" %}

- 要让 bigpipe 正常运行，需要前端引入 bigpipe.js, 另外 pagelet 为 quickling 模式，是不会自动加载的，需要用户主动去调用 BigPipe.load 方法，才会加载并渲染


### 客户端 Pagelet

对外暴露以下几个方法。

### Pagelet.onPageletArrive

此方法不需要主动去调用，当 pagelet 输出的时候会自动调用这个方法。不管是 `chunk` 输出的 `pagelet`, 还是靠第二次请求 `quickling` 类型的 `pagelet` 都是靠此方法渲染。

示例：

```javascript
Pagelet.onPageletArrive({"container":"pages-container","id":"spage","html":"contact us","js":[],"css":[],"styles":[],"scripts":[]});
```

格式说明 

* `container` 容器
* `id` pagelet id
* `html` 内容
* `js` 外联 js 集合
* `css` 外联 css 集合
* `styles` 内联 css 集合
* `scripts` 内联 js 集合

### Pagelet.load

默认 `quickling` 性质的 `pagelet` 不会主动加载，需要用户主动调用此方法，才会开始加载。

调用方式：

```
Pagelet.load({
        url:'/news/index/' + pager.pageIndex + '/' + pager.pageSize,
        pagelets: ['list'],
        container: 'articleList',
        param: 'key1=val1&key2=val2',
        callback: function (data) {
            console.log(data);
            successCallback(data);
            console.log('pipe load done');
        }
});
```

参数说明

* `pagelets` pagelets 的 id 列表，可以是单个 pagelet， 也可以是多个用空格隔开，或者直接就是一个数组，里面由 pagelet id 组成。
* `url` 页面地址，默认是从当前页面去加载 pagelet，有时你可能需要加载其他页面的 pagelet。
* `param` 附带参数内容。
* `container` 指定 pagelet 渲染时的容器。
* `callback` 回调，完成后触发。

### 服务器controller实现


```javascript
router.get('/async', function (req, res) {

    //you can assign async data like this  the async content will be rendered in chunk mode
    res.bigpipe.bind('async', function(setter) {

        // simulate an async progress
        setTimeout(function() {

            // now set data to the pagelet
            setter(null, {
                title:'bigpipe async test',
                content:'async 此类 widget 在输出时，也只会输出个壳子，但是内容在 body 输出完后，chunk 输出 js 自动填充。widget 将忽略顺序，谁先准备好，谁先输出。'
            });
        }, 2000);
    });

    res.render('page/test/async/async.tpl', {});
});
```

## 服务器标签

### pagelet标签

```
支持 id ,tag, append 参数: tag="none" 或者没有 表示不生成标签, append=true 表示进行Pagelet.load 方法时内容时追加,否则为替换, 默认为内容替换.
{% pagelet id="list" tag="none" append="true" %}
     {% widget "widget/news/index/index.tpl" %}
{% endpagelet %}
```

### pagelet客户端结合Pagelet.load方法使用

```
Pagelet.load({
        url:'/news/index/' + pager.pageIndex + '/' + pager.pageSize,
        pagelets: ['list'],
        container: 'articleList',
        param: 'key1=val1&key2=val2',
        callback: function (data) {
            console.log(data);
            successCallback(data);
            console.log('pipe load done');
        }
});
```

## 自定义node_modules依赖

- weg-swig 基于swig进行扩展,支持`html`、`head`、`body`、`pagelet`、`widget`、`script`、`style` 等扩展标签
- weg-resource 前端静态资源map依赖表解析插件
- weg-bigpipe  bigpipe和pagelet 插件

## 自定义框架中间件

- middleware.js  中间件根据配置文件自动注册
- router.js  遍历指定目录自动注册路由


## 参考框架

- yog
- yogurt
