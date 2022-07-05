import { useState, useEffect, useRef, useCallback } from 'react';
import { BasicDndOptions, CommonUtils, useStore } from '../components/CommonUtils';

export type IDragOptions = BasicDndOptions;

type DragStartInfo = {
  startEleInfo: DOMRect | null;
  startCoords: DragEvent | null;
};

export default function useDragClone(option: IDragOptions): any[] {
  const { isDropped, currentDragCategory, setDragCat, setDropState } = useStore();

  const [isDraggable, makeDraggable] = useState(true);
  const [refresher, setRefresher] = useState();
  const [startInfo, setStartInfo] = useState<DragStartInfo>({
    startEleInfo: null,
    startCoords: null,
  });
  const [dragMap, setDragMap] = useState<any>(null);

  const dragRef = useRef(null);

  const utils = new CommonUtils();

  const { currentItemCategory, disableCurrent, applyToChildren } = option;

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

  const setSettings: any = {
    setRefresher,
    makeDraggable,
  };

  useEffect(() => {
    if (dragRef.current) {
      setDragMap(utils.drawDndTargetMap(dragRef.current! as HTMLElement));
    }
  }, [dragRef.current]);

  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    if ((!disableCurrent || disableCurrent == null) && (applyToChildren || applyToChildren == null)) {
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = isDraggable;
      });
    } else if (disableCurrent && (applyToChildren == null || applyToChildren)) {
      dragItemsCnt.draggable = isDraggable;
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = isDraggable;
      });
    } else if (disableCurrent && !(applyToChildren == null || applyToChildren)) {
      dragItemsCnt.draggable = isDraggable;
      dragItemsCnt.childNodes.forEach(item => {
        (item! as HTMLElement).draggable = !isDraggable;
      });
    } else {
      throw new Error('Invalid Option! Change the value of disableCurrent or applyToChildren!');
    }
  }, [isDraggable, refresher]);

  useEffect(() => {
    const dragItemsCnt = dragRef.current! as HTMLElement;
    if ((!disableCurrent || disableCurrent == null) && (applyToChildren || applyToChildren == null)) {
      dragItemsCnt.childNodes.forEach(item => item.addEventListener('dragstart', updateDragTargetInfo));
    } else if (disableCurrent && (applyToChildren == null || applyToChildren)) {
      dragItemsCnt.addEventListener('dragstart', updateDragTargetInfo);
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
