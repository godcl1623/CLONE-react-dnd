import '../styles/style.css';
import useDropClone, { IDropOptions } from '../hooks/useDropClone';
import useDragClone, { IDragOptions } from '../hooks/useDragClone';
import useGlobalStates from '../hooks/useGlobalStates';

export default function App() {
  const { isDropped, currentDragCategory, currentDropCategory } = useGlobalStates();
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
    disableCurrent: true,
  };
  const dragOptions2: IDragOptions = {
    currentItemCategory: {
      level0: ['test 2'],
      level1: ['item 4', 'item 5', 'dropRef']
    }
  };
  const [dropRef] = useDropClone(dropOptions);
  const [dragRef, dragInfo] = useDragClone(dragOptions);
  const [dragRef2] = useDragClone(dragOptions2);

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
            onDrop={e => console.log(isDropped, currentDragCategory, currentDropCategory)}
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
    </div>
  );
}
