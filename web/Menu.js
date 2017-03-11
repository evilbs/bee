import React, { Component } from 'react';
import { Menu, Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';
import application from 'framework/application';
const SubMenu = Menu.SubMenu;

class MenuComponent extends Component {
  render() {
    var collapse = false;
    var routers = application.router;

    return (
      <Menu class="" mode="inline" theme="dark" defaultSelectedKeys={['user']}> 
        <Menu.Item key="folder">
          <Icon type="folder" />
          {!collapse && <span className="nav-text">
            <Link to='/plugins'>插件管理</Link>
          </span>}
        </Menu.Item>
        {routers && Object.keys(routers).map(function (key) {
          var moduleRouter = routers[key];
          return moduleRouter && Object.keys(moduleRouter).map(function (routerKey,index) {
            var router = moduleRouter[routerKey];
            return <Menu.Item key={key+index}>
              <Icon type="folder" />
              {!collapse && <span className="nav-text">
                <Link to={`/plugin/${key}/${routerKey}`}>{router.name}</Link>
              </span>}
            </Menu.Item>
          })
        })}
      </Menu>
    );
  }
}

export default MenuComponent;