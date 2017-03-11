# bee

## 欢迎使用
Bee is use to build a mordern web admin application much easier and more fun.

### 概念
1. 前后端分离，通讯方式采用rpc。
2. 插件机制，框架只做rpc基础通讯服务、插件打包。

### 插件
1. 后端action，调用一个action就是执行一个动作，如获取新闻列表、发布一条新闻、删除一条新闻等等，框架会把所有的action通过rpc的方式暴露给前端调用。
2. 前端component，定义前端区域显示的react组件。
3. 前端路由，路由会生成一个菜单的链接，每个路由都要有一个对应的component。

### 运行方式
1. npm i
2. node .
3. open http://localhost:3000

## 插件开发demo-todolist
我们通过一个todolist的应用来描述怎么使用bee.为了简单我们就不创建数据库，直接把数据存储在内存中。

1. 创建后端action，根据需求，我们将创建以下action
	1. 获取todo列表:  getTodoList()
	2. 创建一条todo:  createTodo(title)
  3. 完成一条todo:  completeTodo(todoId) 
2. 创建前端界面
3. 创建路由