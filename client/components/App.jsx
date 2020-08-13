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
      week: 1,
      events: [],
      people: [],
      grouping: [],
      newPerson: ''
    };
    this.addPerson = this.addPerson.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    this.deleteInDB = this.deleteInDB.bind(this);
    this.trackName = this.trackName.bind(this);
    this.addOnePerson = this.addOnePerson.bind(this);
    this.eventForPreview = this.eventForPreview.bind(this);
    this.saveDay = this.saveDay.bind(this);
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

  // handleChange(newEvents) {
  //   console.log('I got new events in App!!!!');
  //   this.setState({
  //     ...this.state,
  //     needsUpdate: true
  //   })
  // }

  trackName(e) {
    this.setState({
      ...this.state,
      newPerson: e.target.value
    })
  }

  addOnePerson() {
    const grouping = document.querySelector('#grouping').value;
    console.log('grouping: ', grouping)
    document.querySelector('#people').value = '';
    document.querySelector('#grouping').value = '';
    this.setState({
      ...this.state,
      people: [...this.state.people, this.state.newPerson],
      grouping: [...this.state.grouping, grouping],
      newPerson: ''
    })
  }

  eventForPreview() {
    const location = document.querySelector('#location').value;
    const time_start = document.querySelector('#startTime').value;
    const time_end = document.querySelector('#endTime').value;
    const info = document.querySelector('#info').value;
    const newEvent = {
      location,
      time_start,
      time_end,
      info,
      name: [...this.state.people],
      grouping: [...this.state.grouping],
      key: Math.random()
    }
    document.querySelector('#location').value = '';
    document.querySelector('#startTime').value = null;
    document.querySelector('#endTime').value = null;
    document.querySelector('#info').value = '';
    this.setState({
      ...this.state,
      events: [...this.state.events, newEvent],
      people: [],
      grouping: []
    })
  }

  saveDay() {
    const copy = [...this.state.events];
    const sendIt = JSON.stringify({ events: [...this.state.events], day: this.state.day });

    fetch('/populate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: sendIt
    }).then(() => {
     

      fetch('/populate')
      .then(data => data.json())
      .then(data => {
        console.log('response from full fetch: ', data)
        const newEvents = [];
        data.forEach(e => {
          if (e.name.includes(mapped.name) && e.info === mapped.info) {
            newEvents.push(e);
          }
        })
        console.log('newEvents: ', newEvents)
        const dayId = newEvents[0].day_id;
        console.log('dayId : ', dayId)
        const newDay = [...this.state.days[dayId - 1], ...newEvents];
        const days = [...this.state.days];
        days.splice(dayId - 1, 1, newDay);
        this.setState({
          ...this.state,
          days
        })
      })

    })
      .catch(err => {
        console.log('Error in catch in CreateDash: ', err);
      });

    this.setState({
      ...this.state,
      events: []
    })

    // console.log('copy???: ', copy);
    const mapped = copy.map(e => {
      return { info: e.info, week_id: 1, name: e.name[0] }
    })
    console.log('mapped is: ', mapped);

    // fetch('/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(mapped)
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log('response was: ', response);
    //   })
    //   .catch(err => {
    //     console.log('FETCH ERROR :', err);
    //   })

    // fetch('/populate')
    //   .then(data => data.json())
    //   .then(data => {
    //     console.log('response from full fetch: ', data)
    //     const newEvents = [];
    //     data.forEach(e => {
    //       if (e.name.includes(mapped.name) && e.info === mapped.info) {
    //         newEvents.push(e);
    //       }
    //     })
    //     console.log('newEvents: ', newEvents)
    //     const dayId = newEvents[0].day_id;
    //     console.log('dayId : ', dayId)
    //     const newDay = [...this.state.days[dayId - 1], ...newEvents];
    //     const days = [...this.state.days];
    //     days.splice(dayId - 1, 1, newDay);
    //     this.setState({
    //       ...this.state,
    //       days
    //     })
    //   })
  }

  render() {
    // console.log(this.state.days)
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
        <CreateDash day={this.state.day} people={this.state.people} events={this.state.events} grouping={this.state.grouping} newPerson={this.state.newPerson} trackName={this.trackName} addOnePerson={this.addOnePerson} eventForPreview={this.eventForPreview} saveDay={this.saveDay}/>
      </div>
    );
  }
}

export default App;