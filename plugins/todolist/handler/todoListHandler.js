var todoListRepository = require('../repository/todoListRepository');

module.exports = function* () {
  return todoListRepository.getList();
}