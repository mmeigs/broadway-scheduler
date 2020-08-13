import React, { Component } from 'react';
import PreviewDay from './PreviewDay.jsx';



class CreateDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      people: [],
      grouping: [],
      newPerson: ''
    }
    this.trackName = this.trackName.bind(this);
    this.addOnePerson = this.addOnePerson.bind(this);
    this.eventForPreview = this.eventForPreview.bind(this);
    this.saveDay = this.saveDay.bind(this);
  }

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
    const sendIt = JSON.stringify({ events: [...this.state.events], day: this.props.day });

    fetch('/populate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: sendIt
    }).then(response => {
      console.log(response);
      // response.json();
      console.log(response.json())
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

    fetch('/populate')
      .then(data => data.json())
      .then(data => {
        const newEvents = [];
        data.forEach(e => {
          if (e.name.includes(mapped.name) && e.info === mapped.info) {
            newEvents.push(e);
          }
        })
        this.props.handleChange(newEvents);
      })
  }

  render() {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const chosen = this.state.people.slice().join(',  ');
    return (
      <div className='createDash'>
        <h3 className='createDay'>Day Editing Now : {dayNames[this.props.day - 1]}</h3>
        <div className='row1'>
          <div className='location'>
            <label htmlFor='location'>Location:</label>
            <input type='text' id='location'/>
          </div>
          <div className='time'>
            <label htmlFor='startTime'>Time:</label>
            <input type='time' id='startTime' name='startTime'/>
            <label htmlFor='endTime'> - </label>
            <input type='time' id='endTime' name='endTime'/>
          </div>
          <div className='people'>
            <label htmlFor='people'>People/Group:</label>
            <input type='text' id='people' name='people' onChange={this.trackName}/>
            <label htmlFor='dept'>Dept:</label>
            <input type='text' id='grouping' name='dept'/>
            <button className='addPpl' onClick={this.addOnePerson}>Add Person</button>
          </div>
        </div>
        <div className='row2'>
          <div className='info'>
            <label htmlFor='info'>Additional Info:</label>
            <input type='text' id='info' name='info'/>
          </div>
          <div className='previewEvent'>
            <button id='previewEvent' onClick={this.eventForPreview}>Preview Event</button>
          </div>
          <div className='chosen'>
            <h6>People chosen: </h6>
            <p>{chosen}</p>
          </div>
        </div>
        <PreviewDay events={[...this.state.events]}/>
        <button id='addEvent' onClick={this.saveDay}>Save Day</button>
      </div>
    );
  }
}

export default CreateDash;