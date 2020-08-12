import React, { Component } from 'react';

class Event extends Component {
  render() {
    const { location, info, name, grouping } = this.props;
    let { start, end } = this.props;
    start = `${((Number(start.slice(0, 2)) + 11) % 12 + 1)}${start.slice(2, 5)}`;
    end = `${((Number(end.slice(0, 2)) + 11) % 12 + 1)}${end.slice(2, 5)}`;

    return(
      <div className='event'>
        <h3>{start}-{end} <span>{location}</span></h3>
        <p>{name.join(', ')}</p>
        <p>{info}</p>
      </div>
    );
  }
}

export default Event;