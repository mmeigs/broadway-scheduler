import React, { Component } from 'react';
import Day from './Day.jsx';


class PreviewDay extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='preview'>
        <Day dayObj={this.props.events}/>
      </div>
    );
  }
}

export default PreviewDay;