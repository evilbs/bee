var newsRepository = require('../repository/newsRepository');

module.exports = function* () {
  return newsRepository.getList();
}