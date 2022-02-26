import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BasicDndOptions, HandlerTemplate, HandlerTemplateOptions, CommonUtils } from '../components/CommonUtils';
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
    // if (!disableParent && !applyToChildren) {
    //   dragItems.draggable = isDraggable;
    //   eventsList.forEach((event, idx) => {
    //     dragItems.addEventListener(
    //       event,
    //       (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
    //       );
    //     });
    //     dragItems.addEventListener('dragstart', (e: Event) => {
    //       dispatch(updateDragCategory((currentItemCategory! as string[])[0]));
    //       setLocalDragTarget((currentItemCategory! as string[])[0]);
    //   });
    // } else {
    //   dragItems.childNodes.forEach((item, idx) => {
    //     const HTMLItem = item as HTMLElement;
    //     HTMLItem.draggable = isDraggable;
    //     eventsList.forEach((evt, idx) => {
    //       HTMLItem.addEventListener(
    //         evt,
    //         (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
    //         );
    //       });
    //       item.addEventListener('dragstart', (e: Event) => {
    //         dispatch(updateDragCategory((currentItemCategory! as string[])[idx]));
    //         setLocalDragTarget((currentItemCategory! as string[])[idx]);
    //     });
    //   });
    // }
    dragItems.childNodes.forEach(item => {
      const htmlItem = item as HTMLElement;
      htmlItem.draggable = isDraggable;
      eventsList.forEach((evt, idx) => {
        htmlItem.addEventListener(
          evt,
          (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
        );
      });
    });
    return () => {
      dragItems.childNodes.forEach(item => {
        const htmlItem = item as HTMLElement;
        eventsList.forEach((evt, idx) => {
          htmlItem.removeEventListener(
            evt,
            (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
          );
        });
      });
    };
  }, [isDraggable]);

  // useEffect(() => {
  //   if (currentDragTarget != null) {
  //     setObjTest({...objTest, testObj: currentDragTarget.getBoundingClientRect()})
  //   }
  // }, [currentDragTarget])
  const utils = new CommonUtils();
  const [tempDragMap, setDragMap] = useState<any>(null);
  useEffect(() => {
    if (dragRef.current) {
      setDragMap(utils.drawDndTargetMap(dragRef.current! as HTMLElement));
    }
  }, [dragRef.current]);

  const testFunc = useCallback(
    (e: Event) => {
      const currentDragMap = disableParent ? Object.values(tempDragMap).slice(1) : Object.values(tempDragMap);
      const dragMapIncludesTarget = currentDragMap.find(level =>
        (level! as HTMLElement[]).includes(e.target! as HTMLElement)
      );
      const currentDragItemIdx = (dragMapIncludesTarget! as HTMLElement[]).indexOf(e.target! as HTMLElement);
      if (currentItemCategory) {
        const categoryList = Object.values(currentItemCategory)[0];
        dispatch(updateDragCategory(categoryList[currentDragItemIdx]));
      }
    },
    [tempDragMap]
  );

  useEffect(() => {
    const dragItems = dragRef.current! as HTMLElement;
    dragItems.childNodes.forEach(item => item.addEventListener('dragstart', testFunc));
    return () => dragItems.childNodes.forEach(item => item.removeEventListener('dragstart', testFunc));
  }, [testFunc]);

  return [dragRef, objTest];
}
