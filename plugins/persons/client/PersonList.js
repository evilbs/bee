import React, { Component } from 'react';
import application from 'framework/application';

class PersonList extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading:true,
      persons:[]
    }
  }

  componentWillMount(){
    application.doAction('personList').then((persons)=>{
      this.setState({loading:false,persons:persons});
    })
  }

  render() {
    return (
      <div> 
      {
        this.state.loading ? 
        <div>loading...</div> :
        <table>
          <tr>
            <td>id</td>
            <td>name</td>
            <td>address</td>
          </tr>
          {
            this.state.persons && this.state.persons.map((person,index)=>{
              return <tr key={index}>
                <td>{person.id}</td>
                <td>{person.name}</td>
                <td>{person.address}</td>
              </tr>
            })
          }
        </table>
      }
      </div>
    );
  }
}
 
module.exports = PersonList;