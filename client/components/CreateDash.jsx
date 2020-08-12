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
    document.querySelector('#people').value = '';
    const grouping = document.querySelector('#dept').value;
    document.querySelector('#dept').value = '';
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
    fetch('/populate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.events)
    })
      .then(response = response.json())
      .then(response => {
        console.log('Success posting from CreateDash!');
        this.setState({
          ...this.state,
          events: []
        })
      })
      .catch(err => {
        console.log('Error in catch in CreateDash: ', err);
      })
  }

  render() {
    return (
      <div className='createDash'>
        <h3 className='createDay'>DAY OF WEEK</h3>
        <div className='grid'>
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
            <input type='text' id='dept' name='dept'/>
            <button className='addPpl' onClick={this.addOnePerson}>Add Person</button>
          </div>
          <div className='chosen'>
            
          </div>
          <div className='info'>
            <label htmlFor='info'>Additional Info:</label>
            <input type='text' id='info' name='info'/>
          </div>
          <div className='previewEvent'>
            <button id='previewEvent' onClick={this.eventForPreview}>Preview Event</button>
          </div>
        </div>
        <PreviewDay events={[...this.state.events]}/>
        <button id='addEvent' onClick={this.saveDay}>Save Day</button>
      </div>
    );
  }
}

export default CreateDash;