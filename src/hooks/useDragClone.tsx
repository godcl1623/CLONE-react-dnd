import { useState, useEffect, useRef, useCallback } from 'react';
import { BasicDndOptions, CommonUtils, useStore } from '../components/CommonUtils';

export type IDragOptions = BasicDndOptions;
type DragInfo = {
  startInfo: {
    startEleInfo: DOMRect | null;
    startCoords: DragEvent | null;
  };
  lastInfo: {
    lastEleInfo: DOMRect | null;
    lastCoords: DragEvent | null;
  };
};

export default function useDragClone(option: IDragOptions): any[] {
  const { isDropped, currentDragCategory, setDragTgt, setDragCat, setDropState } = useStore();
  const [isDraggable, makeDraggable] = useState(true);
  const [refresher, setRefresher] = useState();
  const [dragInfo, setdragInfo] = useState<DragInfo>({
    startInfo: {
      startEleInfo: null,
      startCoords: null
    },
    lastInfo: {
      lastEleInfo: null,
      lastCoords: null
    },
  });
  const [dragMap, setDragMap] = useState<any>(null);
  const dragRef = useRef(null);
  const utils = new CommonUtils();

  const updateGlobalDragTarget = (dragTarget: HTMLElement) => setDragTgt(dragTarget);

  const {
    currentItemCategory,
    disableCurrent,
    applyToChildren,
  } = option;

  const updateDragInfo = (
    startEleInfo: DOMRect = dragInfo.startInfo.startEleInfo! as DOMRect,
    startCoords: DragEvent = dragInfo.startInfo.startCoords! as DragEvent,
    lastEleInfo: DOMRect = dragInfo.lastInfo.lastEleInfo! as DOMRect,
    lastCoords: DragEvent = dragInfo.lastInfo.lastCoords! as DragEvent
  ): void => {
    setdragInfo({
      ...dragInfo,
      startInfo: {
        ...dragInfo.startInfo,
        startEleInfo,
        startCoords
      },
      lastInfo: {
        ...dragInfo.lastInfo,
        lastEleInfo,
        lastCoords
      }
    });
  };

  const updateDragTargetInfo = useCallback(
    (e: Event) => {
      const currentDragMap = disableCurrent ? Object.values(dragMap).slice(1) : Object.values(dragMap);
      const dragMapIncludesTarget = currentDragMap.find(level =>
        (level! as HTMLElement[]).includes(e.target! as HTMLElement)
      );
      const currentDragItemIdx = (dragMapIncludesTarget! as HTMLElement[]).indexOf(e.target! as HTMLElement);
      if (currentItemCategory) {
        const categoryList = Object.values(currentItemCategory)[0];
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
        updateDragInfo((e.target! as HTMLElement).getBoundingClientRect(), e! as DragEvent);
      }
    },
    [dragMap, isDropped, currentDragCategory]
  );

  const updateDroppedTargetInfo = useCallback(
    (e: Event) => {
      if (isDropped) {
        if (dragInfo.startInfo.startEleInfo) {
          updateDragInfo(
            dragInfo.startInfo.startEleInfo,
            dragInfo.startInfo.startCoords! as DragEvent,
            (e.target! as HTMLElement).getBoundingClientRect(),
            e! as DragEvent
          );
        }
      }
    },
    [isDropped]
  );

  const setSettings: any = {
    updateGlobalDragTarget,
    setRefresher,
    makeDraggable
  }

  /* ############### 드래그 구조 업데이트 ############### */
  useEffect(() => {
    if (dragRef.current) {
      setDragMap(utils.drawDndTargetMap(dragRef.current! as HTMLElement));
    }
  }, [dragRef.current]);

  /* ############### 옵션에 따른 drag 활성화 ############### */
  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    if ((disableCurrent == null || disableCurrent) && (applyToChildren == null || applyToChildren)) {
      // 기본값: 자식 요소만 적용
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = isDraggable;
      });
    } else if (!(disableCurrent == null || disableCurrent) && (applyToChildren == null || applyToChildren)) {
      // 컨테이너, 자식 요소 모두 적용
      dragItemsCnt.draggable = isDraggable;
    } else if ((disableCurrent == null || disableCurrent) && !(applyToChildren == null || applyToChildren)) {
      // 컨테이너만 적용
      dragItemsCnt.draggable = isDraggable;
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = !isDraggable;
      });
    } else {
      throw new Error('Invalid Option! Change the value of disableCurrent or applyToChildren!');
    }
  }, [isDraggable, refresher]);

  /* ############### 드래그 대상 정보 업데이트 ############### */
  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    if ((disableCurrent == null || disableCurrent) && (applyToChildren == null || applyToChildren)) {
      // 기본값: 자식 요소만 적용
      dragItemsCnt.childNodes.forEach(item => item.addEventListener('dragstart', updateDragTargetInfo));
    } else if (!(disableCurrent == null || disableCurrent) && (applyToChildren == null || applyToChildren)) {
      // 컨테이너, 자식 요소 모두 적용
      dragItemsCnt.addEventListener('dragstart', updateDragTargetInfo);
    } else if ((disableCurrent == null || disableCurrent) && !(applyToChildren == null || applyToChildren)) {
      // 컨테이너만 적용
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

  /* ############### 드롭 대상 정보 업데이트 ############### */
  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    if ((disableCurrent == null || disableCurrent) && (applyToChildren == null || applyToChildren)) {
      // 기본값: 자식 요소만 적용
      dragItemsCnt.childNodes.forEach(item => item.addEventListener('dragend', updateDroppedTargetInfo));
    } else if (!(disableCurrent == null || disableCurrent) && (applyToChildren == null || applyToChildren)) {
      // 컨테이너, 자식 요소 모두 적용
      dragItemsCnt.addEventListener('dragend', updateDroppedTargetInfo);
    } else if ((disableCurrent == null || disableCurrent) && !(applyToChildren == null || applyToChildren)) {
      // 컨테이너만 적용
      dragItemsCnt.addEventListener('dragend', updateDroppedTargetInfo);
      dragItemsCnt.childNodes.forEach(item =>
        item.addEventListener('dragend', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        })
      );
    } else {
      throw new Error('Invalid Option! Change the value of disableCurrent or applyToChildren!');
    }
    return () => {
      dragItemsCnt.removeEventListener('dragend', updateDroppedTargetInfo);
      dragItemsCnt.childNodes.forEach(item => item.removeEventListener('dragend', updateDroppedTargetInfo));
    };
  }, [updateDroppedTargetInfo]);

  return [dragRef, dragInfo, setSettings];
}
