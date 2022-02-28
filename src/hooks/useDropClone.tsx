import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BasicDndOptions, HandlerTemplate, CommonUtils } from '../components/CommonUtils';
import { setCurrentDropTarget, updateDropCategory, updateDropMap, updateDropState } from '../actions';
import { RootState } from '../reducers';

export type IDropOptions = BasicDndOptions;
type DropResult = {
  lastDroppedLevel: number;
  lastDroppedResult: string;
}

export default function useDropClone(option: IDropOptions): any {
  /* ############### state 정리 ############### */
  const dropMap = useSelector((state: RootState) => state.dropMap);
  const currentDragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const currentDropCategory = useSelector((state: RootState) => state.currentDropCategory);
  const [lastdropResult, setDropResult] = useState<DropResult>({
    lastDroppedLevel: -1,
    lastDroppedResult: ''
  });
  const dropRef = useRef(null);
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
    dropHandler,
  } = option;

  const handlerLists = [
    dragHandler,
    dragendHandler,
    dragenterHandler,
    dragexitHandler,
    dragleaveHandler,
    dragoverHandler,
    dragstartHandler,
    dropHandler,
  ];

  const testUpdateDropResult = (
    lastDroppedLevel: number = (lastdropResult! as DropResult).lastDroppedLevel,
    lastDroppedResult: string = (lastdropResult! as DropResult).lastDroppedResult
  ): void => {
    setDropResult({
      ...lastdropResult,
      lastDroppedLevel,
      lastDroppedResult
    });
  }

  const initiateDropInfo = useCallback(
    (e: Event) => {
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find(level => level.includes(htmlTarget))
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        const targetIdxInNodes = Array.from((htmlTarget.parentNode! as HTMLElement).childNodes).indexOf(htmlTarget);
        if (currentItemCategory) {
          const dropCategory = (Object.values(currentItemCategory)[levelOfDropTarget])[targetIdxInNodes];
          dispatch(updateDropCategory(dropCategory));
        }
      }
    },
    [dropMap]
  );

  const runDropHandler = useCallback((e: Event) => {
    if (dropHandler) {
      if (currentDragCategory === currentDropCategory) {
        dropHandler(e);
      }
    }
    dispatch(setCurrentDropTarget(e.target! as HTMLElement));
    dispatch(updateDropState(true));
    if (dropMap) {
      const htmlTarget = e.target! as HTMLElement;
      const levelIncludesDropTarget = Object.values(dropMap).find(level => level.includes(htmlTarget))
      const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
      testUpdateDropResult(levelOfDropTarget, levelOfDropTarget === 0 ? 'root' : 'child');
    }
  }, [currentDragCategory, currentDropCategory]);

  /* ############### drop 구조 정리 ############### */
  useEffect(() => {
    if (dropRef.current) {
      dispatch(updateDropMap(utils.drawDndTargetMap(dropRef.current, 0)));
    }
  }, [dropRef.current]);

  /* ############### 사용자 커스텀 핸들러 일괄 적용(drop 제외) ############### */
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    eventsList.forEach((evt, idx) => {
      dropzoneRef.addEventListener(evt, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
    });
    return () => eventsList.forEach((evt, idx) => {
      dropzoneRef.removeEventListener(evt, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
    });
  }, []);

  /* ############### drop 대상 정보(현재 계층, 드롭 대상 카테고리) 정리 ############### */
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('dragenter', initiateDropInfo);
    return () => dropzoneRef.removeEventListener('dragenter', initiateDropInfo);
  }, [initiateDropInfo]);

  /* ############### drop 핸들러 적용 ############### */
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('drop', runDropHandler);
    return () => dropzoneRef.removeEventListener('drop', runDropHandler);
  }, [runDropHandler])

  return [dropRef, lastdropResult];
}
