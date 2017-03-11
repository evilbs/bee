var persons = [];
for (var i = 0; i < 10; i++) {
  var person = {
    id: i,
    name: 'zhou' + i,
    address: 'jianxi' + i
  };

  persons.push(person);
}

module.exports = () => {
  return persons;
}