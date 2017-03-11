import axios from 'axios';

const application = {
  router: {},
  doAction: function (name, params) {
    var url = "http://120.25.194.53:3000/rpc/";
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
