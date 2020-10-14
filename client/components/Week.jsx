import React, { Component } from 'react';
import Day from './Day.jsx';

const fetch = require('node-fetch');

class Week extends Component {

  render() {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const days = [];
    for(let i = 0; i < this.props.days.length; i++) {
      const dayObj = this.props.days[i];
      let key = Math.random();
      if (dayObj.length) {
        key = dayObj[0].event_id;
      }
      days.push(<Day key={key} dayObj={dayObj} week={this.props.week} input={i+1} dayName={dayNames[i]} deleteInDB={this.props.deleteInDB} handleClick={this.props.handleClick}/>);
    }

    console.log(days)

    return (
      <div className='week'>
        {days}
      </div>
    );
  }
}

export default Week;