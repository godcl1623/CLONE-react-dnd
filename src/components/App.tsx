import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';
import { setCurrentDragTarget } from '../actions';
import { RootState } from '../reducers';

export default function App() {
  const dispatch = useDispatch();
  const dropOptions: IDropOptions = {
    currentItemCategory: ['test1', ['test2', 'test1'], 'test3', 'test4', 'test5'],
    disableParent: true,
    applyToChildren: true,
    dropHandler: (e: Event) => {
      alert(e.target);
    }
  }
  const dragOptions: IDragOptions = {
    currentItemCategory: ['test1', 'test2', 'test3'],
    disableParent: true,
    applyToChildren: true,
    dragstartHandler: (e: Event) => {
      const HTMLEventTarget = e.target! as HTMLElement;
      dispatch(setCurrentDragTarget(HTMLEventTarget));
    }
  }
  const [ dropRef, doh ] = useDropClone(dropOptions);
  const [ dragRef, bar ] = useDragClone(dragOptions);

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
          <div id="dropzone" ref={dropRef}>
            {children}
          </div>
          <div id="item-container" ref={dragRef}>
            <div className="item" >item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
          </div>
        </div>
    </div>
  );
}