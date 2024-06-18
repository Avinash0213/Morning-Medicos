// src/App.js
import React from 'react';
import './App.css';
import VideoList from './VideoList';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Channel Videos checking</h1>
      </header>
      <main>
        <VideoList/>
      </main>
    </div>
  );
};

export default App;
