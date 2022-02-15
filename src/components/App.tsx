import React from 'react';
import '../styles/style.css';
import useDnd from '../hooks/useDnd';

export default function App() {
  const [ dropzone, itemContainer ] = useDnd();

  return (
    <div id='App'>
        <div id="dnd-test-zone">
          <div id="dropzone" ref={dropzone}></div>
          <div id="item-container" ref={itemContainer}>
            <div className="item">item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
          </div>
        </div>
    </div>
  );
}