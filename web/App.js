import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import NewList from './news';
import { Menu, Breadcrumb, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import Plugin from './framework/Plugins';
import MenuComponent from './Menu';
import application from 'framework/application';
import 'antd/dist/antd.css';
import './style/index.less';

var router = require('../plugin_loader.js!./plugin_hook');   // registerddassssdffdf... sdfddddas   dddfssdd

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    }
  }

  onCollapseChange() {
    this.setState({
      collapse: !this.state.collapse,
    })
  }

  render() {
    const collapse = this.state.collapse;
    return (
      <div className={collapse ? "layout-aside layout-aside-collapse" : "layout-aside"}>
        <aside className="layout-sider">
          <div className="layout-logo">
            <Link to='/' className="ant-layout-logo-text">new bee</Link>
          </div>
          <MenuComponent collapse={this.collapse}></MenuComponent>
          <div className="aside-action" onClick={this.onCollapseChange}>
            {collapse ? <Icon type="right" /> : <Icon type="left" />}
          </div>
        </aside>
        <div className="layout-main">
          <div className="layout-header">
            <h2 className="ant-title">newbee系统，你的后台运营好帮手！</h2>
            <Menu className='header-menu header-right' mode='horizontal'>
              <SubMenu style={{ float: 'right' }} title={< span > <Icon type='user' /> admin</span>}>
                <Menu.Item key='logout'>
                  <a>注销</a>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
          <div className="layout-container">
            {this.props.children}
            {!this.props.children && <div className="index-content">渐进式的应用程序框架</div>}
          </div>
          <div className="layout-footer">
            new bee all rights reserved © 2017 Created by new bee team
          </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    var routers = application.router;
    return (
      <Router history={browserHistory}>
        <Route path="/" component={AppContainer}>
          <Route path="/index" component={Index}></Route>
          <Route path="/plugins" component={Plugin}></Route>
          {
            // 生产插件的router
            routers && Object.keys(routers).map(function (key) {
              var moduleRouter = routers[key];
              return moduleRouter && Object.keys(moduleRouter).map(function (routerKey, index) {
                var router = moduleRouter[routerKey];
                return <Route path={`/plugin/${key}/${routerKey}`} component={router.component} />
              })
            })
          }
          <Route path="*" component={NoMatch} />
        </Route>
      </Router>
    )
  }
}

class Index extends Component {
  render() {
    return <div>hello index</div>
  }
}

class NoMatch extends Component {
  render() {
    return <div>hello nomatch</div>
  }
}

export default App;