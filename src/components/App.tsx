import React from 'react';
import '../styles/style.css';
import ApplyDnd from './ApplyDnd';

export default function App() {
  return (
    <div id='App'>
      <ApplyDnd>
        <div id="dnd-test-zone">
          <div id="dropzone"></div>
          <div id="item-container">
            <div className="item">item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
          </div>
        </div>
      </ApplyDnd>
    </div>
  );
}