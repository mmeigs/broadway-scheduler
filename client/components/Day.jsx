import React from 'react';
import Event from './Event.jsx';

const Day = (props) => {
  // iterate through props.thisObj for each event
  const events = [];
  // console.log('day', props.dayObj);
  // let day = props.dayObj[0].day_of_week ? props.dayObj[0].day_of_week : '';
  let day = '';
  if (props.dayObj !== undefined && props.dayObj.length) {
    day = props.dayObj[0].day_of_week;
    for (let i = 0; i < props.dayObj.length; i++) {
    const { time_start, time_end, location, info, name, grouping, key } = props.dayObj[i];
    events.push(<Event start={time_start} end={time_end} location={location} info={info} name={name} grouping={grouping} key={`e${key}`}/>);
    }
  }

  return(
    <div className='day'>
      <h3>{day}</h3>
      {events}
    </div>
  );
}

export default Day;