import React, { Component } from 'react';
import { Table } from 'antd';
import application from './framework/application';
  
class NewList extends Component {   
  constructor(props) {
    super(props);
    this.state = {   
      loading: true,
      todos: [],
      actions: []
    };
  }

  componentWillMount() {
    this.loadActions();
    this.loadTodos();
  }

  loadActions() {
    var that = this;
    application.doAction('getActions',{tag:'todo'}).then(function (actions) {
      that.setState({ actions: actions });
    });
  }

  loadTodos() {
    var that = this;
    application.doAction('todoList').then(function (todos) {
      that.setState({ loading: false, todos: todos });
    });
  }

  doAction(actionName, id) {
    var that = this;
    application.doAction(actionName, { id }).then(function () {
      that.loadTodos();
    });    
  }

  render() {
    const dataSource = this.state.todos;
    const that = this;
    const columns = [{
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: 'state',
      dataIndex: 'state',
      key: 'state',
    }, {
      title: 'operate',
      render: (text, record) => (
        <span>
          {
            that.state.actions.map((action)=>{
              return <div><button onClick={() => { that.doAction(action, record.id) }}>{action}</button></div>
            })
          }
        </span>
      )
    }];

    return this.state.loading ? <div>loading...</div> : <Table dataSource={dataSource} columns={columns} />;
  }
}

export default NewList;