import React, { Component } from 'react';
import Week from './Week.jsx';
import CreateDash from './CreateDash.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 1,
      days: [[],[],[],[],[],[],[]],
      week: 1,
      events: [],
      people: [],
      grouping: [],
      newPerson: '',
      only: [[],[],[],[],[],[],[]]
    };
    this.addPerson = this.addPerson.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.deleteInDB = this.deleteInDB.bind(this);
    this.trackName = this.trackName.bind(this);
    this.addOnePerson = this.addOnePerson.bind(this);
    this.eventForPreview = this.eventForPreview.bind(this);
    this.saveDay = this.saveDay.bind(this);
    this.refreshEvents = this.refreshEvents.bind(this);
    this.showOnly = this.showOnly.bind(this);
    this.showAll = this.showAll.bind(this);
    this.nextWeek = this.nextWeek.bind(this);
    this.prevWeek = this.prevWeek.bind(this);
  }

  componentDidMount() {
    fetch('/populate/')
      .then(data => data.json())
      .then(events => {
        const days = [[],[],[],[],[],[],[]];
        // console.log('They should be here: ', events)
        for (let i = 0; i < events.length; i++) {
          if (events[i].week_id === this.state.week) {
            // console.log(events[i]);
            const day = events[i].day_id - ((events[i].week_id - 1) * 7) - 1;
            // const day = events[i].day_id - 1;
            days[day].push(events[i]);
          }
        }
        this.setState({
          ...this.state,
          days,
        });
      })
  }

  
  refreshEvents() {
    fetch('/populate')
        .then(data => data.json())
        .then(data => {
          // console.log('response from full fetch: ', data)
          const newEvents = [];
          data.forEach(e => {
            for (let i = 0; i < this.state.events.length; i++) {
              if (e.name.includes(this.state.events[i].name[0]) && e.info === this.state.events[i].info) {
                newEvents.push(e);
              }
            }
          })
          console.log('newEvents: ', newEvents)
          const dayId = newEvents[0].day_id;
          const weekId = newEvents[0].week_id;
          console.log('dayId : ', dayId)
          console.log('weekId : ', weekId)
          console.log(dayId - ((weekId - 1)*7) - 1); // CHANGED THIS FOR WEEKSSS
          const newDay = [...this.state.days[(dayId - ((weekId - 1)*7) - 1)], ...newEvents]; // AND THIS
          console.log('newDay is : ', newDay);
          const days = [...this.state.days];
          days.splice((dayId - ((weekId - 1)*7) - 1), 1, newDay); // AND THIS
          console.log('about to return: ', days);
          this.setState({
            ...this.state,
            events: [],
            days
          })
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
    // console.log('dayId : ', day)
    this.setState({
      day 
    })
  }

  deleteInDB(id, day_id) {
    // console.log(id, day_id);
    fetch('/populate', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .catch(err => console.log(err));

    let days = this.state.days.slice();
    const day = [...this.state.days[day_id - ((this.state.week - 1) * 7) - 1]];
    const restday = day.filter(e => e.event_id !== id);
    days.splice((day_id - ((this.state.week - 1) * 7) - 1), 1, restday)

    this.setState({
      ...this.state,
      days
    });
  }

  trackName(e) {
    this.setState({
      ...this.state,
      newPerson: e.target.value
    })
  }

  addOnePerson() {
    const grouping = document.querySelector('#grouping').value;
    // console.log('grouping: ', grouping)
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
    // console.log(this.state.day)
    const sendIt = JSON.stringify({ events: [...this.state.events], day: this.state.day , week: this.state.week });
    // console.log('post stuff: ', sendIt);
      fetch('/populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: sendIt
      })
      // .then(() => {
      //   console.log('I got into the dot then that starts fetching the rest')
        .catch(err => {
          console.log('Error in catch in CreateDash: ', err);
        });

    // })
  }

  showOnly() {
    const name = document.querySelector('#showOnly').value;
    document.querySelector('#showOnly').value = '';
    const only = this.state.days.reduce((acc, cur, i) => {
      const day = cur.filter(e => e.name.includes(name) || e.name.includes('Full Company'));
      console.log(`${i} day has events: ${day}`);
      acc[i] = day;
      return acc;
    }, [[],[],[],[],[],[],[]]);
    console.log('outside reduce: ', only);
    const daysCopy = [...this.state.days];
    this.setState({
      ...this.state,
      days: only,
      only: daysCopy
    })
  }

  showAll() {
    this.setState({
      ...this.state,
      days: this.state.only,
      only: []
    })
  }

  nextWeek() {
    console.log('next week clicked')
    this.setState({
      ...this.state,
      week: this.state.week + 1
    })

    fetch('/populate/')
      .then(data => data.json())
      .then(events => {
        const days = [[],[],[],[],[],[],[]];
        console.log(events)
        for (let i = 0; i < events.length; i++) {
          if (events[i].week_id === this.state.week) {
            console.log(events[i]);
            const day = events[i].day_id - ((events[i].week_id - 1) * 7) - 1;
            // const day = events[i].day_id - 1;
            days[day].push(events[i]);
          }
        }
        this.setState({
          ...this.state,
          days,
        });
      })
  }

  prevWeek() {
    console.log('previous week clicked')
    this.setState({
      ...this.state,
      week: this.state.week - 1
    })

    fetch('/populate/')
      .then(data => data.json())
      .then(events => {
        const days = [[],[],[],[],[],[],[]];
        console.log(events)
        for (let i = 0; i < events.length; i++) {
          if (events[i].week_id === this.state.week) {
            console.log(events[i]);
            const day = events[i].day_id - ((events[i].week_id - 1) * 7) - 1;
            // const day = events[i].day_id - 1;
            days[day].push(events[i]);
          }
        }
        this.setState({
          ...this.state,
          days,
        });
      })
  }

  render() {
    return (
      <div className='app'>
        <div id='login'>
          <input name="username" id='showOnly' type="text" placeholder="name"></input>
          {/* <input name="password" type="password" placeholder="password"></input> */}
          <input type='submit' value="showOnly" onClick={this.showOnly}></input>
          <input type='submit' value='showAll' onClick={this.showAll}></input>
        </div>

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

        <div class='changeWeek'>
          <button id='prevWeek' onClick={this.prevWeek}>Previous</button>
          <h4 id="currentWeek">Current Week</h4>
          <button id='nextWeek' onClick={this.nextWeek}>Next</button>
        </div>
        <Week days={this.state.days} week={this.state.week} deleteInDB={this.deleteInDB} handleClick={this.handleClick}/>
        <div class='refresher'>
          <button onClick={this.refreshEvents} id='refresh'>Refresh!!</button>
        </div>
        <hr/>
        <CreateDash day={this.state.day} week={this.state.week} people={this.state.people} events={this.state.events} grouping={this.state.grouping} newPerson={this.state.newPerson} trackName={this.trackName} addOnePerson={this.addOnePerson} eventForPreview={this.eventForPreview} saveDay={this.saveDay}/>
      </div>
    );
  }
}

export default App;