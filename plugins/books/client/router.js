const router = {
  personList: {
    name: '书列表',
    component: require('./BookList')
  }
};

require('framework/application').addRouter('bookes',router); 