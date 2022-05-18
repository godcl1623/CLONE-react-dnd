import React from 'react';
import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';
import useGlobalStates from '../hooks/useGlobalStates';

export default function App() {
  const drop = React.useRef<any>();
  const drag = React.useRef<any>();
  const { currentDragTarget: dragTarget } = useGlobalStates();
  const dropOptions: IDropOptions = {
    currentItemCategory: {
      level0: ['dropRef'],
      level1: ['item 1', 'item 2'],
      level2: ['test3']
    },
    applyToChildren: true
  };
  const dragOptions: IDragOptions = {
    currentItemCategory: {
      level0: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'],
    }
  };
  // const [dropRef, dropResult] = useDropClone(dropOptions);
  // const [dragRef, dragInfo, setSettings] = useDragClone(dragOptions);
  // const { updateGlobalDragTarget } = setSettings;
  React.useEffect(() => {
    if (drag.current) {
      drag.current.childNodes.forEach((ele: any) => { ele.draggable = true });
    }
  }, [drag.current])

  return (
    <div id="App">
      {/* <div id="dnd-test-zone">
        <div
          id="dropzone"
        >
          <div
            id="item-container"
            ref={el => {
              dropRef.current = el;
              dragRef.current = el;
            }}
            onDragStart={e => {
              const HTMLEventTarget = e.target! as HTMLElement;
              if (e.target !== dragTarget) {
                updateGlobalDragTarget(HTMLEventTarget);
              }
            }}
            onDragEnd={e => {
              const HTMLEventTarget = e.target! as HTMLElement;
              const parent = HTMLEventTarget.parentNode;
              const list = Array.from((parent! as HTMLElement).childNodes);
              const currentIdx = list.indexOf(HTMLEventTarget);
              const { startInfo, lastInfo } = dragInfo;
              const { startEleInfo, startCoords } = startInfo;
              const { lastEleInfo, lastCoords } = lastInfo;
              const computedStyle = window.getComputedStyle(HTMLEventTarget);
              const targetMargin = parseInt(computedStyle.marginTop, 10) + parseInt(computedStyle.marginBottom, 10);
              const targetHeight = lastEleInfo.height;
              const minNextEleTop = targetMargin + targetHeight;
              const targetMovedDistance = lastCoords.clientY - startCoords.clientY;
              if (targetMovedDistance > minNextEleTop) {
                const distanceToIdx = Math.floor(targetMovedDistance / minNextEleTop);
                const idxToAdd = distanceToIdx >= list.length ? list.length - 1 : distanceToIdx;
                const insertCrit =
                  currentIdx + idxToAdd + 1 > list.length ? list.length : currentIdx + idxToAdd + 1;
                parent?.removeChild(HTMLEventTarget);
                parent?.insertBefore(HTMLEventTarget, list[insertCrit]);
              } else if (targetMovedDistance * -1 > minNextEleTop) {
                const distanceToIdx = Math.floor(targetMovedDistance * -1 / minNextEleTop);
                const idxToSub = distanceToIdx >= list.length ? list.length - 1 : distanceToIdx;
                const insertCrit = currentIdx - idxToSub <= 0 ? 0 : currentIdx - idxToSub;
                parent?.removeChild(HTMLEventTarget);
                parent?.insertBefore(HTMLEventTarget, list[insertCrit]);
              }
            }}
          >
            dropRef
            <div className="item cnt">
              item 1
              <div className="item">item 3</div>
              <div className="item">item 4</div>
              <div className="item">item 5</div>
            </div>
            <div className="item cnt">
              item 2
              <div className="item">item 6</div>
              <div className="item">item 7</div>
              <div className="item">item 8</div>
            </div>
          </div>
        </div>
      </div> */}
      <div
        id="dropzone"
        ref={drop}
        onDragOver={e => e.preventDefault()}
        onDrop={e => console.log('drop', console.log(e.clientY))}
      >

      </div>
      <div className="cnt" ref={drag} onDrag={e => console.log('dragging', e.clientY)} onDragEnd={e => console.log('dragEnd', e.clientY)} onDragOver={e => e.preventDefault()} onDrop={e => console.log('drop', e.clientY)}>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </div>
    </div>
  );
}
