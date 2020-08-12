import React, { Component } from 'react';
import Week from './Week.jsx';
import CreateDash from './CreateDash.jsx';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <form method="POST" action='/login' id='login'>
          <input name="username" type="text" placeholder="username"></input>
          <input name="password" type="password" placeholder="password"></input>
          <input type='submit' value="login"></input>
        </form>
        
        <h2 id='showName'>Codesmith the Musical</h2>
        <h5 id="currentWeek">Current Week</h5>
        <Week />
        <CreateDash />
      </div>
    );
  }
}

export default App;