import axios from 'axios';
import config from './config';

const application = {
  router: {},
  doAction: function (name, params) {
    var url = config.rpcUrl;
    url += name;
    return axios.get(url, { params })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  addRouter: function (pluginName, prouter) {
    application.router[pluginName] = prouter;
  }
};

module.exports = application;
