# aaa组件使用教程

## 获取的请求

```vue
   let data = await this.$api.result('/sysRole/list')
   console.log(data)
```

## 组件使用demo

### 1. aaaCurd 搭配了弹窗表单组件 具体demo看/views/system/use.vue

###

//todo 字典地址、统计（平均、总数）、字典（二级表头） //done url,字段，查询条件、工具栏、操作栏、选中、序号、字典（一级表头） //done
多级表头，ant自带，columns使用children即可，可查看[表头分组](https://www.antdv.com/components/table-cn/#components-table-demo-grouping-table-head])
//done 树形：ant自带，后台返回children的数据即可，[树形数据](https://www.antdv.com/components/table-cn/#components-table-demo-tree-data)

### 1.1 分解版

### div层

```vue
  <aaa-table :config="config"/>
```

### data层

1. url: 请求后台地址
1. columns: 延用ant-table
1. query：查询条件，label:'查询字段中文名，key: 查询字段英文名，placeholder: 提示语,width: 宽度（默认130）
1. tool: 工具栏，label:'操作名称'默认（添加），method: 执行内容,auth: 权限值（可不填）
1. do: 操作栏，label:'操作名称'默认（详情），method: 执行内容，auth: 权限值（可不填）
1. @change 数据改变
1. select: e => {this.select = e} 选中框，把选择的id给select，是数组[1,2,3]
1. del：删除的地址

```vue
config: {
          url: '/sysUser/getUserList',
          columns: [
            { title: '用户名', dataIndex: 'name', ellipsis: true },
          ],
          query: [{ label: '关键字', key: 'str' }],
          // 表单内容
          form: {
            // 添加、编辑、删除、禁用、启用得用enable字段
            add: '/',
            edit: '/',
            del: '/',
            enable: '/',
            // 中间按钮 type 默认为空，得配套返回
            actions: [{
              label: '重置密码',type:'', url: '/', fun: e => {
                this.resetEd = true
              }
            }],
            back: e => this.resetEd = false,
            disabled: e => {
              this.disabled = e
            }
          },
          tools: [{method: e => {console.log('添加', 'e')}}],
          actions: [{method: e => {console.log(e, 'e')}}],
          select: e => {this.select = e}
        }
```

### 2. aaaTable 重新整理，用aaaCurd

# ant原始文档

- 预览: https://preview.pro.antdv.com
- 首页: https://pro.antdv.com
- 文档: https://pro.antdv.com/docs/getting-started
- 更新日志: https://pro.antdv.com/docs/changelog
- 常见问题: https://pro.antdv.com/docs/faq

Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/)
实现的 [Ant Design Pro](https://pro.ant.design/)

![dashboard](https://static-2.loacg.com/open/static/github/SP1.png)

环境和依赖
----

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现

> 请注意，我们强烈建议本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。



项目下载和运行
----

- 拉取项目代码

```bash
git clone https://github.com/vueComponent/ant-design-vue-pro.git
cd ant-design-vue-pro
```

- 安装依赖

```
yarn install
```

- 开发模式运行

```
yarn run serve
```

- 编译项目

```
yarn run build
```

- Lints and fixes files

```
yarn run lint
```


## 浏览器兼容

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| IE10, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## Contributors

This project exists thanks to all the people who contribute.
<a href="https://github.com/vueComponent/ant-design-vue-pro/graphs/contributors"><img src="https://opencollective.com/ant-design-pro-vue/contributors.svg?width=890&button=false" /></a>

