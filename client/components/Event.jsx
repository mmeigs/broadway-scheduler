import React, { Component } from 'react';

class Event extends Component {


  render() {
    const { location, info, name, grouping, event_id, day_id } = this.props;
    let { start, end } = this.props;
    if (start && end) {
      start = `${((Number(start.slice(0, 2)) + 11) % 12 + 1)}${start.slice(2, 5)}`;
      end = `${((Number(end.slice(0, 2)) + 11) % 12 + 1)}${end.slice(2, 5)}`;
    }
    

    return(
      <div className='event'>
        <h3>{start}-{end}</h3>
        <h4>{location}</h4>
        <p>{name.join(', ')}</p>
        <hr/>
        <p class='infoP'>{info}</p>
        <button className="deleteE" onClick={() => { this.props.deleteInDB(event_id, day_id)} }>delete</button>
      </div>
    );
  }
}

export default Event;