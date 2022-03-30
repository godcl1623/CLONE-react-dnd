import { useEffect, useRef, useState, useCallback } from 'react';
import { BasicDndOptions, CommonUtils, useStore } from '../components/CommonUtils';

// export type IDropOptions = Omit<BasicDndOptions, 'disableCurrent' | 'applyToChildren'>;
export type IDropOptions = BasicDndOptions;
type DropResult = {
  lastDroppedLevel: number;
  lastDroppedResult: string;
};

export default function useDropClone(option: IDropOptions): any {
  /* ############### state 정리 ############### */
  const {
    dropMap,
    currentDragCategory,
    currentDropCategory,
    currentDropTarget,
    setDropCat,
    setDropTgt,
    setDropState,
    setDropMap,
  } = useStore();
  const [lastdropResult, setDropResult] = useState<DropResult>({
    lastDroppedLevel: -1,
    lastDroppedResult: '',
  });
  const dropRef = useRef(null);
  const utils = new CommonUtils();

  const { currentItemCategory, applyToChildren } = option;

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

  const initiateDropInfo = useCallback((e: Event) => {
    if (dropMap) {
      const htmlTarget = e.target! as HTMLElement;
      const levelIncludesDropTarget = Object.values(dropMap).find((level: any) => level.includes(htmlTarget));
      const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
      const targetIdxInNodes = (currentItemCategory as (string | string[])[]).length > 1 ? Array.from((htmlTarget.parentNode! as HTMLElement).childNodes).indexOf(htmlTarget) : 0;
      if (currentItemCategory) {
        let dropCategory = '';
        if (applyToChildren) {
          dropCategory = Object.values(currentItemCategory)[levelOfDropTarget][targetIdxInNodes];
        } else {
          dropCategory = Object.values(currentItemCategory)[0][targetIdxInNodes];
        }
        if (dropCategory) {
          setDropCat(dropCategory);
        }
      }
    }
  }, [dropMap]);

  const runDropHandler = useCallback(
    (e: Event) => {
      if (e.target !== currentDropTarget) {
        setDropTgt(e.target! as HTMLElement);
      }
      setDropState(true);
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find((level: any) => level.includes(htmlTarget));
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        updateDropResult(levelOfDropTarget, levelOfDropTarget === 0 ? 'root' : 'child');
      }
    },
    [currentDragCategory, currentDropCategory]
  );

  /* ############### drop 구조 정리 ############### */
  useEffect(() => {
    setDropMap(utils.drawDndTargetMap(dropRef.current! as HTMLElement, 0));
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
