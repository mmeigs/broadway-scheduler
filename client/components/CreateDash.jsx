import React, { Component } from 'react';
import PreviewDay from './PreviewDay.jsx';



class CreateDash extends Component {

  render() {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const chosen = this.props.people.slice().join(',  ');
    return (
      <div className='createDash'>
        <h3 className='createDay'>You Are Now Editing : {dayNames[this.props.day - ((this.props.week - 1) * 7) - 1]}</h3>
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
            <input type='text' id='people' name='people' onChange={this.props.trackName}/>
            <label htmlFor='dept'>Dept:</label>
            <input type='text' id='grouping' name='dept'/>
            <button className='addPpl' onClick={this.props.addOnePerson}>Add Person</button>
          </div>
        </div>
        <div className='row2'>
          <div className='info'>
            <label htmlFor='info'>Additional Info:</label>
            <input type='text' id='info' name='info'/>
          </div>
          <div className='previewEvent'>
            <button id='previewEvent' onClick={this.props.eventForPreview}>Preview Event</button>
          </div>
          <div className='chosen'>
            <h6>People chosen: </h6>
            <p>{chosen}</p>
          </div>
        </div>
        <PreviewDay events={[...this.props.events]}/>
        <button id='addEvent' onClick={this.props.saveDay}>Save Day</button>
      </div>
    );
  }
}

export default CreateDash;