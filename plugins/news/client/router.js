var NewsList = require('./NewsList');
import application from 'framework/application';

const router = {
  newsList: {
    name: '新闻列表',
    component: NewsList
  }
};

application.addRouter('news',router); 