// src/App.js
import React from 'react';
import './App.css';
import VideoList from './VideoList';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MORNING MEDICOS</h1>
      </header>
      <main>
        <VideoList/>
      </main>
    </div>
  );
};

export default App;
