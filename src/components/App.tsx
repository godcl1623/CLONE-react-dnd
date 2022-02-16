import React from 'react';
import '../styles/style.css';
import useDropClone from '../hooks/useDropClone';
import useDragClone from '../hooks/useDragClone';

export default function App() {
  const [ dropContainer ] = useDropClone();
  const [ itemContainer ] = useDragClone();

  return (
    <div id='App'>
        <div id="dnd-test-zone">
          <div id="dropzone" ref={dropContainer}></div>
          <div id="item-container" ref={itemContainer}>
            <div className="item">item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
          </div>
        </div>
    </div>
  );
}