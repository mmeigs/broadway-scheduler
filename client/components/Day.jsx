import React from 'react';
import Event from './Event.jsx';

const Day = (props) => {

  const events = [];
  let day = '';

  if (props.dayObj !== undefined && props.dayObj.length) {
    day = props.dayObj[0].day_of_week;

    for (let i = 0; i < props.dayObj.length; i++) {
      const { time_start, time_end, location, info, name, grouping, key, event_id, day_id } = props.dayObj[i];
      events.push(<Event start={time_start} end={time_end} location={location} info={info} name={name} grouping={grouping} event_id={ event_id } day_id={day_id} key={`e${key}`} deleteInDB={props.deleteInDB}/>);
    }
  }

  return(
    <button className='day' onClick={() => {props.handleClick(props.input)}}>
      <h3>{props.dayName}</h3>
      {events}
    </button>
  );
}

export default Day;