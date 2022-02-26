import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BasicDndOptions, HandlerTemplate, HandlerTemplateOptions, CommonUtils } from '../components/CommonUtils';
import { RootState } from '../reducers';
import { updateDragCategory } from '../actions';

export type IDragOptions = Omit<BasicDndOptions, 'dropHandler'>;

export default function useDragClone(option: IDragOptions): any[] {
  const [isDraggable, makeDraggable] = useState(true);
  const [objTest, setObjTest] = useState<any>({});
  const [tempDragMap, setDragMap] = useState<any>(null);
  const dragRef = useRef(null);
  const eventsList = ['drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart'];
  const dispatch = useDispatch();
  const utils = new CommonUtils();

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

  const updateDragTargetInfo = useCallback(
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

  /* ############### 드래그 구조 업데이트 ############### */
  useEffect(() => {
    if (dragRef.current) {
      setDragMap(utils.drawDndTargetMap(dragRef.current! as HTMLElement));
    }
  }, [dragRef.current]);

  /* ############### 사용자 커스텀 핸들러 일괄 적용 ############### */
  useEffect(() => {
    const dragItems = dragRef.current! as HTMLElement;
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

  /* ############### 드래그 대상 정보 업데이트 ############### */
  useEffect(() => {
    const dragItems = dragRef.current! as HTMLElement;
    dragItems.childNodes.forEach(item => item.addEventListener('dragstart', updateDragTargetInfo));
    return () => dragItems.childNodes.forEach(item => item.removeEventListener('dragstart', updateDragTargetInfo));
  }, [updateDragTargetInfo]);

  return [dragRef, objTest];
}
