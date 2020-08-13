import React, { Component } from 'react';
import Week from './Week.jsx';
import CreateDash from './CreateDash.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needsUpdate: false,
      day: 1,
      days: [[],[],[],[],[],[],[]],
      week: 1
    };
    this.addPerson = this.addPerson.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteInDB = this.deleteInDB.bind(this);
  }

  componentDidMount() {
    fetch('/populate/')
      .then(data => data.json())
      .then(events => {
        const days = [[],[],[],[],[],[],[]];
        for (let i = 0; i < events.length; i++) {
          if (events[i].week_id === this.state.week) {
            const day = events[i].day_id - 1;
            days[day].push(events[i]);
          }
        }
        this.setState({
          ...this.state,
          days,
        });
      })
  }

  addPerson() {
    const name = document.querySelector('#name').value;
    const grouping = document.querySelector('#dept').value;
    const role = document.querySelector('#role').value;
    const sendThis = JSON.stringify({ name, grouping, role });

    fetch('/add', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      data: sendThis,
      body: sendThis
    })
      .catch(err => console.log(err))

    document.querySelector('#name').value = '';
    document.querySelector('#dept').value = '';
    document.querySelector('#role').value = '';
  }

  handleClick(day) {
    this.setState({
      day 
    })
  }

  deleteInDB(id, day_id) {
    fetch('/populate', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .catch(err => console.log(err));

    let days = this.state.days.slice();
    const day = [...this.state.days[day_id - 1]];
    const restday = day.filter(e => e.event_id !== id);
    days.splice(day_id - 1, 1, restday)

    this.setState({
      ...this.state,
      days
    });
  }

  handleChange(newEvents) {
    console.log('I got new events in App!!!!');
    this.setState({
      ...this.state,
      needsUpdate: true
    })
  }

  render() {
    console.log(this.state.days)
    return (
      <div className='app'>
        <form method="POST" action='/login' id='login'>
          <input name="username" type="text" placeholder="username"></input>
          <input name="password" type="password" placeholder="password"></input>
          <input type='submit' value="login"></input>
        </form>

        <div className='addPerson'>
            <h3>Add a Co-worker</h3>
            <button onClick={this.addPerson}>Add</button>
            <div>
              <input name="name" id="name" type="text" placeholder="name"></input>
              <input name="role/job" id="role" type="text" placeholder="role/job"></input>
              <input name="dept" id="dept" type="text" placeholder="dept/grouping"></input>
            </div>
        </div>

        <h2 id='showName'>Codesmith the Musical</h2>
        <h5 id="currentWeek">Current Week</h5>
        <Week days={this.state.days} week={this.state.week} deleteInDB={this.deleteInDB} handleClick={this.handleClick}/>
        <hr/>
        <CreateDash day={this.state.day} changed={this.handleChange}/>
      </div>
    );
  }
}

export default App;