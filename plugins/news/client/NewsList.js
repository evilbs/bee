import React, { Component } from 'react';
import application from 'framework/application';

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      news: [],
      actions: []
    };
  }

  componentWillMount() {
    this.loadNews();
  }

  loadNews() {
    var that = this;
    application.doAction('newsList').then(function (news) {
      that.setState({ loading: false, news: news });
    });
  }

  render() {
    return <table>
      <tr>
        <td>id</td>
        <td>title</td>
        <td>state</td>
      </tr>
      {this.state.news.length > 0 && this.state.news.map((newsItem) => {
        return <tr>
          <td>{newsItem.id}</td>
          <td>{newsItem.title}</td>
          <td>{newsItem.state}</td>
        </tr>
      })}
    </table>
  }
}

module.exports = NewsList;