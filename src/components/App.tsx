import React from 'react';
import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';
import useGlobalStates from '../hooks/useGlobalStates';

export default function App() {
  const drop = React.useRef<any>();
  const drag = React.useRef<any>();
  // const { currentDragTarget: dragTarget } = useGlobalStates();
  const dropOptions: IDropOptions = {
    currentItemCategory: {
      level0: ['dropRef'],
      level1: ['item 1', 'item 2'],
      level2: ['test3', 'test4', 'test5', 'test6', 'test7', 'test8']
    },
    applyToChildren: false
  };
  const dragOptions: IDragOptions = {
    currentItemCategory: {
      level0: ['test 1'],
      level1: ['item 1', 'dropRef', 'item 3']
    },
    // disableCurrent 비활성화시 자식 요소 드래그 안 되는 현상 발생
    // disableCurrent: false,
    // applyToChildren: true
  };
  const dragOptions2: IDragOptions = {
    currentItemCategory: {
      level0: ['test 2'],
      level1: ['item 4', 'item 5', 'dropRef']
    }
  };
  const [dropRef, dropInfo, dropResult] = useDropClone(dropOptions);
  const [dragRef, dragInfo, setSettings] = useDragClone(dragOptions);
  const [dragRef2, dragInfo2] = useDragClone(dragOptions2);

  return (
    <div id="App">
      <div id="dnd-test-zone">
        <div
          id="dropzone"
        >
          <div
            id="item-container"
            ref={dropRef}
            onDragStart={e => console.log(dragInfo)}
            onDrop={e => console.log(dropInfo)}
          >
            dropRef
            <div
              className="item cnt 1"
              ref={dragRef}
            >
              item 1
              <div className="item 3">
              </div>
              <div className="item 4">item 4</div>
              <div className="item 5">
              </div>
            </div>
            <div
              className="item cnt 2"
              ref={dragRef2}
            >
              item 2
              <div className="item 6">item 6</div>
              <div className="item 7">item 7</div>
              <div className="item 8">item 8</div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        id="dropzone"
        ref={dropRef}
        onDrop={e => {
          console.log(dragInfo.startCoords.clientY);
          console.log(dropInfo.dropCoords.clientY);
        }}
      >
        <div>drop point</div>
      </div>
      <div
        className="cnt"
        ref={dragRef}
        onDrag={e => console.log('dragging', e.clientY)}
        onDragEnd={e => console.log('dragEnd', e.clientY)}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          console.log(dragInfo);
          console.log(dropInfo);
        }}
      >
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </div> */}
    </div>
  );
}
