import { useState, useEffect, useRef, useCallback } from 'react';
import { BasicDndOptions, CommonUtils, useStore } from '../components/CommonUtils';

/* ############### 사용 타입 정리 ############### */
// Hook 초기화용 props 타입
export type IDragOptions = BasicDndOptions;
// 드래그 시작 시점 정보 타입
type DragStartInfo = {
  startEleInfo: DOMRect | null;
  startCoords: DragEvent | null;
};

export default function useDragClone(option: IDragOptions): any[] {
  /* ############### 전역 상태 ############### */
  const { isDropped, currentDragCategory, setDragCat, setDropState } = useStore();
  /* ############### 지역 상태 ############### */
  const [isDraggable, makeDraggable] = useState(true);
  const [refresher, setRefresher] = useState();
  const [startInfo, setStartInfo] = useState<DragStartInfo>({
    startEleInfo: null,
    startCoords: null,
  });
  const [dragMap, setDragMap] = useState<any>(null);
  /* ############### 드래그 컨테이너용 Ref ############### */
  const dragRef = useRef(null);
  /* ############### 카테고리 부여 등 기능 활용을 위한 클래스 인스턴스 ############### */
  const utils = new CommonUtils();

  /* ############### 사용 옵션 목록 ############### */
  const { currentItemCategory, disableCurrent, applyToChildren } = option;

  /* ############### 내부 함수 ############### */
  // updateStartInfo(): 드래그 시작 대상의 좌표 등 정보 업데이트(좌표 상태만)
  const updateStartInfo = (
    startEleInfo: DOMRect = startInfo.startEleInfo! as DOMRect,
    startCoords: DragEvent = startInfo.startCoords! as DragEvent
  ): void => {
    setStartInfo({
      ...startInfo,
      startEleInfo,
      startCoords,
    });
  };

  // updateDragTargetInfo(): 드래그 시작 대상 정보 업데이트를 위한 함수(정보 업데이트 로직)
  const updateDragTargetInfo = useCallback(
    (e: Event) => {
      const currentDragMap = Object.values(dragMap);
      const dragMapIncludesTarget = currentDragMap.find(level =>
        (level! as HTMLElement[]).includes(e.target! as HTMLElement)
      );
      const currentDragItemLvl = currentDragMap.indexOf(dragMapIncludesTarget);
      const currentDragItemIdx = (dragMapIncludesTarget! as HTMLElement[]).indexOf(e.target! as HTMLElement);
      if (currentItemCategory) {
        const categoryList = Object.values(currentItemCategory)[currentDragItemLvl];
        if (currentDragCategory !== categoryList[currentDragItemIdx]) {
          if (categoryList.length !== 1) {
            setDragCat(categoryList[currentDragItemIdx]);
          } else {
            setDragCat(categoryList[0]);
          }
        }
        if (isDropped) {
          setDropState(false);
        }
        updateStartInfo((e.target! as HTMLElement).getBoundingClientRect(), e! as DragEvent);
      }
    },
    [dragMap, isDropped, currentDragCategory]
  );

  // 사용자가 활용할 수 있는 도구 모음
  const setSettings: any = {
    // updateGlobalDragTarget,
    setRefresher,
    makeDraggable,
  };

  /* ############### 드래그 구조 업데이트 ############### */
  useEffect(() => {
    if (dragRef.current) {
      setDragMap(utils.drawDndTargetMap(dragRef.current! as HTMLElement));
    }
  }, [dragRef.current]);

  /* ############### 옵션에 따른 drag 활성화 ############### */
  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    // 기본값: 자식 요소만 적용(disableCurrent: 생략 혹은 false, applyToChildren: 생략 혹은 true)
    if ((!disableCurrent || disableCurrent == null) && (applyToChildren || applyToChildren == null)) {
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = isDraggable;
      });
    // 컨테이너, 자식 요소 모두 적용(disableCurrent: true 입력, applyToChildren: true 또는 생략)
    } else if (disableCurrent && (applyToChildren == null || applyToChildren)) {
      dragItemsCnt.draggable = isDraggable;
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = isDraggable;
      });
    // 컨테이너만 적용(disableCurrent: true 입력, applyToChildren: false 입력)
    } else if (disableCurrent && !(applyToChildren == null || applyToChildren)) {
      dragItemsCnt.draggable = isDraggable;
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = !isDraggable;
      });
    // 그 외 경우 - 컨테이너, 자식 모두 비활성화
    } else {
      throw new Error('Invalid Option! Change the value of disableCurrent or applyToChildren!');
    }
  }, [isDraggable, refresher]);

  /* ############### 드래그 대상 정보 업데이트 ############### */
  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    // 기본값: 자식 요소만 적용(disableCurrent: 생략 혹은 false, applyToChildren: 생략 혹은 true)
    if ((!disableCurrent || disableCurrent == null) && (applyToChildren || applyToChildren == null)) {
      dragItemsCnt.childNodes.forEach(item => item.addEventListener('dragstart', updateDragTargetInfo));
    // 컨테이너, 자식 요소 모두 적용(disableCurrent: true 입력, applyToChildren: true 또는 생략)
    } else if (disableCurrent && (applyToChildren == null || applyToChildren)) {
      dragItemsCnt.addEventListener('dragstart', updateDragTargetInfo);
    // 컨테이너만 적용(disableCurrent: true 입력, applyToChildren: false 입력)
    } else if (disableCurrent && !(applyToChildren == null || applyToChildren)) {
      dragItemsCnt.addEventListener('dragstart', updateDragTargetInfo);
      dragItemsCnt.childNodes.forEach(item => {
        item.addEventListener('dragstart', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
    } else {
      throw new Error('Invalid Option! Change the value of disableCurrent or applyToChildren!');
    }
    return () => {
      dragItemsCnt.removeEventListener('dragstart', updateDragTargetInfo);
      dragItemsCnt.childNodes.forEach(item => item.removeEventListener('dragstart', updateDragTargetInfo));
    };
  }, [updateDragTargetInfo]);

  return [dragRef, startInfo, setSettings];
}
