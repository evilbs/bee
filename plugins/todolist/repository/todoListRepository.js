var todos = [
  { id: 1, title: '读socket编程', state: 'init' },
  { id: 2, title: '读深入理解操作系统', state: 'init' },
  { id: 3, title: '读web 性能权威指南', state: 'init' },
  { id: 4, title: '读编程人生：15位软件先驱访谈录（上卷）', state: 'init' },
  { id: 5, title: '读牧羊少年奇幻之旅', state: 'init' },
];


var respository = {
  getList: function (page, size) {
    return todos;
  },
  find(id) {
    for (var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      if (todo.id == id) {
        return todo;
      }
    }

    return null;
  },
  offline: function (id) {
    console.log(id);
    var todo = this.find(id);
    if (!todo) return false;

    todo.state = "offline";
    return true;
  },
  online: function (id) {
    var todo = this.find(id);
    if (!todo) return false;

    todo.state = "init";
    return true;
  },
  setState: function (id, state) {
    var todo = this.find(id);
    if (!todo) return false;

    todo.state = state;
    return true;
  },
  delete: function (id) {
    todos.forEach(function (todo, index) {
      if (todo.id == id) {
        todos.splice(index, 1);
        return true;
      }
    });

    return false;
  }
}

module.exports = respository;