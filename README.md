#weg


基于fis3+express+swig的前端和后端集成解决方案工程解决方案。在阅读此文档之前，希望你最好对fis、swig、express 、mysql有一定的了解。


## 目录

* [特点](#特点)
* [快速开始](#快速开始)
* [目录规范](#目录规范)
 - [client 目录](#前端)
    - [public 目录](#page-目录)
        - [component 目录](#组件)
        - [static 目录](#css／js／image公共静态资源)
    - [views 目录](#static-目录)
      - [page 目录](#页面模板)
      - [widget 目录](#组件)
    - [server.conf](#serverconf)
 - [server 目录](#后端)
    - [controller 目录](#路由)
    - [lib 目录](#组件扩展)
    - [middleware 目录](#中间件)
    - [model 目录](＃数据模型)
    - [utils 目录](＃工具类)
 - [fis-conf.js](#fis配置文件)
 - [server.js](#express启动入口)

## 特点

* 基于原生fis前端集成方案对前端资源进行打包，相比自定义fis扩展，方便fis组件升级和维护。
* 整合前端和后端，提供一套骨架，并提供基于mysql的运行示例，拿来即可使用，扩展也很方便。
* 模板引擎采用 [swig](http://paularmstrong.github.io/swig/) ，提供易用的 `html`、`head`、`body`、`widget`、`script`、`style` 等扩展标签。基于这些标签后端可以自动完成对页面的性能优化。
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
weg release -m  资源文件md5签名 
weg release --optimize --md5 --watch --pack # fis release -omwp
weg release -omwp   o 资源压缩  m 资源文件md5签名  w 文件修改监控   p打包合并
weg server start --timeout 10000  --port 9000   --type node
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
    console.log('>>>>test>>>>>');
    require('client/views/page/news/index/index.js');
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

### bigpipe

采用 bigpipe 方案，允许你在渲染页面的时候，提前将框架输出，后续再把耗时的 pagelet 通过 chunk 方式输出到页面，以加速网页渲染。

- sync 默认就是此模式，直接输出。
- quicking 此类 widget 在输出时，只会输出个壳子，内容由用户自行决定通过 js，另起请求完成填充，包括静态资源加载。
- async 此类 widget 在输出时，也只会输出个壳子，但是内容在 body 输出完后，chunk 输出 js 自动填充。widget 将忽略顺序，谁先准备好，谁先输出。
- pipeline 与 async 基本相同，只是它会严格按顺序输出。

  {% widget "widget/header/header.html" mode="pipeline" id="header" %}

- 要让 bigpipe 正常运行，需要前端引入 bigpipe.js, 另外 pagelet 为 quickling 模式，是不会自动加载的，需要用户主动去调用 BigPipe.load 方法，才会加载并渲染

### fis-conf.js 

编译配置文件，详情请查看[配置 API](http://fis.baidu.com/docs/api/fis-conf.html)。

