import React, { Component } from 'react';

class Event extends Component {
  constructor(props) {
    super(props);

    // this.deleteInDB = this.deleteInDB.bind(this);
  }

  // deleteInDB() {
  //   fetch('/populate', {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ id: this.props.event_id })
  //   })
  //     .then(result => {
  //       console.log('result is: ', result);
  //       // this.deleteInstance();
  //     })
  //     .catch(err => console.log(err));
  // }

  // deleteInstance() {

  // }


  render() {
    const { location, info, name, grouping, event_id, day_id } = this.props;

    // console.log('client id: ', event_id);
    let { start, end } = this.props;
    start = `${((Number(start.slice(0, 2)) + 11) % 12 + 1)}${start.slice(2, 5)}`;
    end = `${((Number(end.slice(0, 2)) + 11) % 12 + 1)}${end.slice(2, 5)}`;

    return(
      <div className='event'>
        <h3>{start}-{end}</h3>
        <h4>{location}</h4>
        <p>{name.join(', ')}</p>
        <hr/>
        <p>{info}</p>
        <button className="deleteE" onClick={() => { this.props.deleteInDB(event_id, day_id)} }>DELETE</button>
      </div>
    );
  }
}

export default Event;