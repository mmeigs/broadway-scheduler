import React from 'react';
import Event from './Event.jsx';

const Day = (props) => {

  const events = [];
  let day = '';
  // console.log(props.dayName, props.handleClick)
  const week = props.week;
  let dayId = ((week - 1) * 7) + props.input;
  let matinee = '';
  let evening = '';
  if (props.dayObj !== undefined && props.dayObj.length) {
    day = props.dayObj[0].day_of_week;
    // dayId = props.dayObj[0].day_id;
    // console.log('slow steps', props.dayObj)
    
    for (let i = 0; i < props.dayObj.length; i++) {
      if (props.dayObj[i].matinee) {
        matinee = props.dayObj[i].matinee;
      }
      if (props.dayObj[i].evening) {
        evening = props.dayObj[i].evening;
        console.log('hi!!')
      }

      if (props.dayObj[i].time_start) {
        const { time_start, time_end, location, info, name, grouping, key, event_id, day_id } = props.dayObj[i];
        events.push(<Event start={time_start} end={time_end} location={location} info={info} name={name} grouping={grouping} event_id={ event_id } day_id={day_id} key={`e${key}`} deleteInDB={props.deleteInDB}/>);
      }
      
    }
  }

  return(
    <button className='day' onClick={() => {props.handleClick(dayId)}}>
      <div className='dayHead'>
        <h3 className='dayName'>{props.dayName}</h3>
        <div>
          <h4 className='showTimes'>{matinee}</h4> 
          <h4 className='showTimes'>{evening}</h4>
        </div>
      </div>
      {events}
    </button>
  );
}

export default Day;