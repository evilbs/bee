import React, { Component } from 'react';
import application from '../application';
import './Plugin.less'
import { Spin } from 'antd';

class PluginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      plugins: []
    };

    this.loadPlugin = this.loadPlugin.bind(this);
    this.unloadPlugin = this.unloadPlugin.bind(this);
  }

  componentWillMount() {
    var that = this;
    application.doAction('getPlugins').then(function (plugins) {
      that.setState({ loading: false, plugins: plugins });
    });
  }

  reloadPlugins() {
    var that = this;
    application.doAction('getPlugins').then(function (plugins) {
      that.setState({ loading: false, plugins: plugins });
    });
  }

  loadPlugin(name) {
    var that = this;
    that.setState({ loading: true });
    application.doAction('loadPlugin', { name }).then(() => {
      that.reload();
    });
  }

  unloadPlugin(name) {
    var that = this;
    that.setState({ loading: true });
    application.doAction('unloadPlugin', { name }).then(() => {
      that.reload();
    });
  }

  reload() {
    window.location.href = '/';
  }

  upload() {
    // Files
    var formData = new FormData();
    var files = document.getElementById('pluginFile').files;
    if (files.length == 0) {
      alert('请选择插件!');
      return;
    }

    var file = files[0];
    formData.append('plugin', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploadPlugin', true);
    xhr.onload = function () { 
      if (this.responseText == 'true') {
        alert('安装成功!');
        window.location.href = '/';
      } else {
        alert('安装失败,请检查你的插件是否按照规范了，我还没做错误检查！')
      }
    };
    xhr.send(formData);
  }

  render() {
    var that = this;
    return (
      <div>
        {this.state.loading && <Spin />}
        {!this.state.loading && <div>
          <ul className="plugins">
            {
              Object.keys(this.state.plugins).map(function (key, index) {
                var plugin = that.state.plugins[key];
                return <li className={plugin.state === "loaded" ? "loaded" : ""} key={index}>
                  <span>{key}</span>
                  <p>{plugin.state === "loaded" ? "已加载" : "未加载"}</p>
                  <p>
                    {
                      plugin.state === "loaded" ? <button onClick={() => { that.unloadPlugin(key) }}>卸载</button> : <button onClick={() => { that.loadPlugin(key) }}>加载</button>
                    }
                  </p>
                </li>
              })
            }
          </ul>
          <div style={{ clear: 'both' }}>
            <h3>上传你的插件</h3>
            <div>
              <input type="file" id='pluginFile' />
              <button onClick={this.upload}>upload</button></div>
          </div>
        </div>
        }
      </div>

    );
  }
}

export default PluginComponent;