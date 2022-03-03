import React, {Component, useState} from 'react';
import Main from './components/Main.js';

export default function App() {
  const [currView, setCurrView] = useState('Main');

  if (currView == 'Main'){
    return <Main />;
  }
}
