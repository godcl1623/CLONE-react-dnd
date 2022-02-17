import React from 'react';
import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';

export default function App() {
  const dropOptions: IDropOptions = {
    disableParent: true,
    applyToChildren: true,
    dropHandler: () => {
      alert('foo');
      alert('bar');
    }
  }
  const dragOptions: IDragOptions = {
    disableParent: true,
    applyToChildren: true
  }
  const [ dropTarget ] = useDropClone(dropOptions);
  const [ dragTarget ] = useDragClone(dragOptions);

  const arr = [1, 2, 3, 4, 5];
  const children = arr.map(idx => 
    <div
      key={idx}
      style={{
        width: '20%',
        height: '20%'
      }}
    />
  );

  return (
    <div id='App'>
        <div id="dnd-test-zone">
          <div id="dropzone" ref={dropTarget}>
            {children}
          </div>
          <div id="item-container" ref={dragTarget}>
            <div className="item" >item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
          </div>
        </div>
    </div>
  );
}