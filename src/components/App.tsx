import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';
import { setCurrentDragTarget } from '../actions';
import { RootState } from '../reducers';

export default function App() {
  const currentDropTarget = useSelector((state: RootState) => state.currentDropTarget);
  const dragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const dropCategory = useSelector((state: RootState) => state.currentDropCategory);
  const isDropped = useSelector((state: RootState) => state.isDropped);
  const [localDrop, setLocalDrop] = useState<any>('');
  const dispatch = useDispatch();
  const dropOptions: IDropOptions = {
    currentItemCategory: {
      level0: ['test1'],
      level1: ['test2'],
      level2: ['test3']
    },
    disableParent: true,
    applyToChildren: true,
    dropHandler: (e: Event) => {
      alert(e.target);
    }
  }
  const dragOptions: IDragOptions = {
    currentItemCategory: {
      level0: ['test1', 'test2', 'test3']
    },
    disableParent: true,
    applyToChildren: true,
    dragstartHandler: (e: Event) => {
      const HTMLEventTarget = e.target! as HTMLElement;
      dispatch(setCurrentDragTarget(HTMLEventTarget));
    }
  }
  const [ dropRef, dropResult ] = useDropClone(dropOptions);
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
          <div
            id="dropzone"
            ref={dropRef}
          >
            <div
              id="dropzone_first_child"
            >
              <div
                id="dropzone_second_child"
              >
              </div>
            </div>
          </div>
          <div
            id="item-container"
            ref={dragRef}
          >
            <div className="item">item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
          </div>
        </div>
    </div>
  );
}