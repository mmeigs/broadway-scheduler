import React, { Component } from 'react';
import Day from './Day.jsx';

const fetch = require('node-fetch');

class Week extends Component {
  // constructor(props) {
  //   super(props);
    // this.state = {
    //   days: [[],[],[],[],[],[],[]],
    //   week: 1
    // }
  // }

  // componentDidMount(){
  //   fetch('/populate/')
  //     .then(data => data.json())
  //     .then(events => {
  //       const days = [[],[],[],[],[],[],[]];
  //       for (let i = 0; i < events.length; i++) {
  //         if (events[i].week_id === this.state.week) {
  //           const day = events[i].day_id - 1;
  //           days[day].push(events[i]);
  //         }
  //       }
  //       this.setState({
  //         ...this.state,
  //         days,
  //       });
  //     })
  // }


  render() {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const days = [];
    for(let i = 0; i < this.props.days.length; i++) {
      const dayObj = this.props.days[i];
      let key = Math.random();
      if (dayObj.length) key = dayObj[0].event_id;
      days.push(<Day key={key} dayObj={dayObj} input={i+1} dayName={dayNames[i]} deleteInDB={this.props.deleteInDB} handleClick={this.props.handleClick}/>);
    }


    return (
      <div className='week'>
        {days}
      </div>
    );
  }
}

export default Week;