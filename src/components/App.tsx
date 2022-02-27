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
  const [cont, setCont] = useState<any>(false);
  const [fir, setFir] = useState<any>(false);
  const [sec, setSec] = useState<any>(false);
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
  const [ dropRef, dropLevel ] = useDropClone(dropOptions);
  const [ dragRef, bar ] = useDragClone(dragOptions);

  // useEffect(() => {
  //   console.log(dropLevel)
  // }, [dropLevel])

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

  useEffect(() => {
    const container = dropRef.current;
    const first = container.childNodes[0];
    const second = first.childNodes[0];
    if (isDropped) {
      switch (currentDropTarget) {
        case localDrop && container:
          setCont(true);
          setFir(false);
          setSec(false);
          break;
        case localDrop && first:
          setFir(true);
          setCont(false);
          setSec(false);
          break;
        case localDrop && second:
          setSec(true);
          setCont(false);
          setFir(false);
          break;
        default:
          setCont(false);
          setFir(false);
          setSec(false);
          break;
      }
    }
  }, [currentDropTarget, isDropped]);

  useEffect(() => {
    console.log(localDrop)
  }, [localDrop])

  return (
    <div id='App'>
        <div id="dnd-test-zone">
          <div
            id="dropzone"
            ref={dropRef}
            onDrop={e => {
              e.stopPropagation();
              setLocalDrop(e.target)
            }}
          >
            <div
              id="dropzone_first_child"
              onDrop={e => {
                e.stopPropagation();
                setLocalDrop(e.target)
              }}
            >
              <div
                id="dropzone_second_child"
                onDrop={e => {
                  e.stopPropagation();
                  setLocalDrop(e.target)
                }}
              >
                { dragCategory === dropCategory && sec
                  ?
                    dropLevel > 1 ? 'dropped' : ''
                  : ''
                }
              </div>
              { dragCategory === dropCategory && fir
                ?
                  dropLevel > 0 && dropLevel === 1 ? 'dropped' : 'dropped on Child'
                : ''
              }
            </div>
            {
              dragCategory === dropCategory && cont
                ?
                  dropLevel === 0 ? 'dropped' : 'dropped on child'
                : ''
            }
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