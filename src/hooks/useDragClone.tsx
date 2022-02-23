import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BasicDndOptions, HandlerTemplate, HandlerTemplateOptions } from '../components/CommonUtils';
import { RootState } from '../reducers';
import { updateDragCategory } from '../actions';

export type IDragOptions = Omit<BasicDndOptions, 'dropHandler'>;

export default function useDragClone(option: IDragOptions): any[] {
  const currentDragTarget = useSelector((state: RootState) => state.currentDragTarget);
  const [localDragTarget, setLocalDragTarget] = useState<string | string[] | null>(null);
  const [isDraggable, makeDraggable] = useState(true);
  const [objTest, setObjTest] = useState<any>({});
  const dragRef = useRef(null);
  const eventsList = ['drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart'];
  const dispatch = useDispatch();

  const {
    currentItemCategory,
    disableParent,
    applyToChildren,
    dragHandler,
    dragendHandler,
    dragenterHandler,
    dragexitHandler,
    dragleaveHandler,
    dragoverHandler,
    dragstartHandler,
  } = option;

  const handlerLists = [
    dragHandler,
    dragendHandler,
    dragenterHandler,
    dragexitHandler,
    dragleaveHandler,
    dragoverHandler,
    dragstartHandler,
  ];

  const templateOptions: HandlerTemplateOptions = {
    disablePreventDefault: true,
    disableStopPropagation: true,
  };

  useEffect(() => {
    const dragItems = dragRef.current! as HTMLElement;
    if (!disableParent && !applyToChildren) {
      dragItems.draggable = isDraggable;
      eventsList.forEach((event, idx) => {
        dragItems.addEventListener(
          event,
          (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
          );
        });
        dragItems.addEventListener('dragstart', (e: Event) => {
          dispatch(updateDragCategory((currentItemCategory! as string[])[0]));
          setLocalDragTarget((currentItemCategory! as string[])[0]);
      });
    } else {
      dragItems.childNodes.forEach((item, idx) => {
        const HTMLItem = item as HTMLElement;
        HTMLItem.draggable = isDraggable;
        eventsList.forEach((evt, idx) => {
          HTMLItem.addEventListener(
            evt,
            (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
            );
          });
          item.addEventListener('dragstart', (e: Event) => {
            dispatch(updateDragCategory((currentItemCategory! as string[])[idx]));
            setLocalDragTarget((currentItemCategory! as string[])[idx]);
        });
      });
    }
  }, [isDraggable]);

  useEffect(() => {
    if (currentDragTarget != null) {
      setObjTest({...objTest, testObj: currentDragTarget.getBoundingClientRect()})
    }
  }, [currentDragTarget])

  return [dragRef, objTest];
}
