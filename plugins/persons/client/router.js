const router = {
  personList: {
    name: '人员列表',
    component: require('./PersonList')
  }
};

require('framework/application').addRouter('news',router); 