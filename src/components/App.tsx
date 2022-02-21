import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';
import { setCurrentDragTarget } from '../actions';
import { RootState } from '../reducers';

type TestType = {
  foo: 'bar';
}

export default function App() {
  const currentDragTarget = useSelector((state: RootState) => state.currentDragTarget);
  const dispatch = useDispatch();
  const dropOptions: IDropOptions = {
    disableParent: true,
    applyToChildren: true,
    dropHandler: (e: Event) => {
      alert(e.target);
    }
  }
  const dragOptions: IDragOptions = {
    disableParent: true,
    applyToChildren: true,
    dragstartHandler: (e: Event) => {
      const HTMLEventTarget = e.target! as HTMLElement;
      dispatch(setCurrentDragTarget(HTMLEventTarget));
    }
  }
  const [ dropRef ] = useDropClone(dropOptions);
  const [ dragRef ] = useDragClone(dragOptions);

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

  React.useEffect(() => {
    console.log(currentDragTarget)
  }, [currentDragTarget]);

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