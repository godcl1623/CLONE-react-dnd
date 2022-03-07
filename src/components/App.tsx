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
  const [foo, setFoo] = useState<any>('');
  const [localDrop, setLocalDrop] = useState<any>('');
  const dispatch = useDispatch();
  const dropOptions: IDropOptions = {
    currentItemCategory: {
      level0: ['test1'],
      level1: ['test2', 'test3', 'test4', 'test5', 'test6', 'test7'],
      // level2: ['test3']
    },
    dropHandler: (e: Event) => {
      alert(e.target);
    },
    applyToChildren: false,
  };
  const dragOptions: IDragOptions = {
    currentItemCategory: {
      level0: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'],
    },
    // dragstartHandler: (e: Event) => {
    //   const HTMLEventTarget = e.target! as HTMLElement;
    //   dispatch(setCurrentDragTarget(HTMLEventTarget));
    // },
    // dragendHandler: (e: Event) => {
    //   const HTMLEventTarget = e.target! as HTMLElement;
    //   const parent = HTMLEventTarget.parentNode;
    //   // parent?.removeChild(HTMLEventTarget);
    //   // parent?.appendChild(HTMLEventTarget);
    // }
    // disableCurrent: false
  };
  const [dropRef, dropResult] = useDropClone(dropOptions);
  const [dragRef, dragInfo] = useDragClone(dragOptions);

  // useEffect(() => {
  //   console.log(dragInfo)
  // }, [dragInfo])

  const arr = [1, 2, 3, 4, 5];
  const children = arr.map(idx => (
    <div
      key={idx}
      style={{
        width: '20%',
        height: '20%',
      }}
    />
  ));

  return (
    <div id="App">
      <div id="dnd-test-zone">
        <div
          id="dropzone"
          // ref={dropRef}
        >
          {/* <div
              id="dropzone_first_child"
            >
              <div
                id="dropzone_second_child"
              >
              </div>
            </div> */}
          <div
            id="item-container"
            // ref={dragRef}
            ref={el => {
              dropRef.current = el;
              dragRef.current = el;
            }}
            onDragStart={e => {
              const HTMLEventTarget = e.target! as HTMLElement;
              dispatch(setCurrentDragTarget(HTMLEventTarget));
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
            }}>
            <div className="item">item 1</div>
            <div className="item">item 2</div>
            <div className="item">item 3</div>
            <div className="item">item 4</div>
            <div className="item">item 5</div>
          </div>
        </div>
      </div>
    </div>
  );
}
