import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BasicDndOptions, CommonUtils } from '../components/CommonUtils';
import { setCurrentDropTarget, updateDropCategory, updateDropMap, updateDropState } from '../actions';
import { RootState } from '../reducers';

export type IDropOptions = Omit<BasicDndOptions, 'disableCurrent' | 'applyToChildren'>;
type DropResult = {
  lastDroppedLevel: number;
  lastDroppedResult: string;
};

export default function useDropClone(option: IDropOptions): any {
  /* ############### state 정리 ############### */
  const dropMap = useSelector((state: RootState) => state.dropMap);
  const currentDragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const currentDropCategory = useSelector((state: RootState) => state.currentDropCategory);
  const [lastdropResult, setDropResult] = useState<DropResult>({
    lastDroppedLevel: -1,
    lastDroppedResult: '',
  });
  const dropRef = useRef(null);
  const dispatch = useDispatch();
  const utils = new CommonUtils();

  const { currentItemCategory } = option;

  const updateDropResult = (
    lastDroppedLevel: number = (lastdropResult! as DropResult).lastDroppedLevel,
    lastDroppedResult: string = (lastdropResult! as DropResult).lastDroppedResult
  ): void => {
    setDropResult({
      ...lastdropResult,
      lastDroppedLevel,
      lastDroppedResult,
    });
  };

  const initiateDropInfo = useCallback(
    (e: Event) => {
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find(level => level.includes(htmlTarget));
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        const targetIdxInNodes = Array.from((htmlTarget.parentNode! as HTMLElement).childNodes).indexOf(htmlTarget);
        if (currentItemCategory) {
          const dropCategory = Object.values(currentItemCategory)[levelOfDropTarget][targetIdxInNodes];
          if (dropCategory) {
            dispatch(updateDropCategory(dropCategory));
          }
        }
      }
    },
    [dropMap]
  );

  const runDropHandler = useCallback(
    (e: Event) => {
      dispatch(setCurrentDropTarget(e.target! as HTMLElement));
      dispatch(updateDropState(true));
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find(level => level.includes(htmlTarget));
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        updateDropResult(levelOfDropTarget, levelOfDropTarget === 0 ? 'root' : 'child');
      }
    },
    [currentDragCategory, currentDropCategory]
  );

  /* ############### drop 구조 정리 ############### */
  useEffect(() => {
    dispatch(updateDropMap(utils.drawDndTargetMap(dropRef.current! as HTMLElement, 0)));
  }, []);

  /* ############### drop 활성화를 위한 dragover 초기화 ############### */
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('dragover', (e: Event) => e.preventDefault());
    return () => dropzoneRef.removeEventListener('dragover', (e: Event) => e.preventDefault());
  }, []);

  /* ############### 예비 drop 대상 정보(현재 계층, 드롭 대상 카테고리) 정리 ############### */
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('dragenter', initiateDropInfo);
    return () => dropzoneRef.removeEventListener('dragenter', initiateDropInfo);
  }, [initiateDropInfo]);

  /* ############### 실제 drop 대상 정보 업데이트 ############### */
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('drop', runDropHandler);
    return () => dropzoneRef.removeEventListener('drop', runDropHandler);
  }, [runDropHandler]);

  return [dropRef, lastdropResult];
}
