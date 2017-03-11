var todoListRepository = require('../../todolist/repository/todoListRepository');

module.exports = function* () { 
  var id = this.query.id; 
  var result = todoListRepository.setState(id,'unNew');
  return result;
}; 