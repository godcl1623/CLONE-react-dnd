import { useEffect, useRef, useState, useCallback } from 'react';
import { BasicDndOptions, CommonUtils, useStore } from '../components/CommonUtils';

/* ############### 사용 타입 정리 ############### */
// Hook 초기화용 props 타입
export type IDropOptions = BasicDndOptions;
// 디버깅용 정보 타입
type __DebugDropResult = {
  __DebugLastDroppedLevel: number;
  __DebugLastDroppedResult: string;
};
// 드롭 시점 정보 타입
type DropInfo = {
  dropEleInfo: DOMRect | null;
  dropCoords: DragEvent | null;
}

export default function useDropClone(option: IDropOptions): any {
  /* ############### state 정리 ############### */
  // 전역 상태 모음
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
  // 지역 상태 모음
  const [__DebugLastdropResult, setDropResult] = useState<__DebugDropResult>({
    __DebugLastDroppedLevel: -1,
    __DebugLastDroppedResult: '',
  });
  const [dropInfo, setDropInfo] = useState<DropInfo>({
    dropEleInfo: null,
    dropCoords: null
  });
  /* ############### 드롭 컨테이너용 Ref ############### */
  const dropRef = useRef(null);
  /* ############### 카테고리 부여 등 기능 활용을 위한 클래스 인스턴스 ############### */
  const utils = new CommonUtils();

  /* ############### 사용 옵션 목록 ############### */
  const { currentItemCategory, applyToChildren } = option;

  /* ############### 내부 함수 ############### */
  // __updateDebugDropResult(): 디버깅용 정보 업데이트
  const __updateDebugDropResult = (
    __DebugLastDroppedLevel: number = (__DebugLastdropResult! as __DebugDropResult).__DebugLastDroppedLevel,
    __DebugLastDroppedResult: string = (__DebugLastdropResult! as __DebugDropResult).__DebugLastDroppedResult
  ): void => {
    setDropResult({
      ...__DebugLastdropResult,
      __DebugLastDroppedLevel,
      __DebugLastDroppedResult,
    });
  };
  // updateDropInfo(): 드롭 지점의 좌표 등 정보 업데이트(좌표 상태만)
  const updateDropInfo = (
    rectInfo: DOMRect | null = (dropInfo! as DropInfo).dropEleInfo as DOMRect,
    eventRes: DragEvent | null = (dropInfo! as DropInfo).dropCoords as DragEvent
  ): void => {
    setDropInfo({
      ...dropInfo,
      dropEleInfo: rectInfo,
      dropCoords: eventRes
    });
  };

  // initiateDropInfo(): 드롭 대상에 카테고리 부여, 드롭 대상 초기화
  const initiateDropInfo = useCallback(
    (e: Event) => {
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find((level: any) => level.includes(htmlTarget));
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        const targetIdxInNodes =
          Object.values(currentItemCategory as any).length > 1
            ? Array.from((htmlTarget.parentNode! as HTMLElement).childNodes).indexOf(htmlTarget)
            : 0;
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
    },
    [dropMap]
  );

  // runDropHandler(): 드롭 지점 정보 업데이트를 위한 함수(정보 업데이트 로직)
  const runDropHandler = useCallback(
    (e: Event) => {
      if (e.target !== currentDropTarget) {
        setDropTgt(e.target! as HTMLElement);
      }
      // setDropState(true);
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find((level: any) => level.includes(htmlTarget));
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        __updateDebugDropResult(levelOfDropTarget, levelOfDropTarget === 0 ? 'root' : 'child');
        if (currentDragCategory === currentDropCategory) {
          updateDropInfo((e.target! as HTMLElement).getBoundingClientRect(), e! as DragEvent);
          setDropState(true);
        } else {
          updateDropInfo(null, null);
        }
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
    dropzoneRef.addEventListener('click', initiateDropInfo);
    return () => dropzoneRef.removeEventListener('drop', runDropHandler);
  }, [runDropHandler]);

  return [dropRef, dropInfo, __DebugLastdropResult];
}
