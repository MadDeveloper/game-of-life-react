import React, { Component } from 'react';
import './App.css';
import { Game } from './components/game/Game'

class App extends Component {
  render() {
    return (
      <section id="main">
        <Game />
      </section>
    );
  }
}

export default App;
