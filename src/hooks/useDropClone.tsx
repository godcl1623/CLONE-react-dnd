import { useEffect, useRef, useState, useCallback } from 'react';
import { BasicDndOptions, CommonUtils, useStore } from '../components/CommonUtils';

export type IDropOptions = BasicDndOptions;

type __DebugDropResult = {
  __DebugLastDroppedLevel: number;
  __DebugLastDroppedResult: string;
};

type DropInfo = {
  dropEleInfo: DOMRect | null;
  dropCoords: DragEvent | null;
}

export default function useDropClone(option: IDropOptions): any {
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

  const [__DebugLastdropResult, setDropResult] = useState<__DebugDropResult>({
    __DebugLastDroppedLevel: -1,
    __DebugLastDroppedResult: '',
  });
  const [dropInfo, setDropInfo] = useState<DropInfo>({
    dropEleInfo: null,
    dropCoords: null
  });

  const dropRef = useRef(null);

  const utils = new CommonUtils();

  const { currentItemCategory, applyToChildren } = option;

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

  const runDropHandler = useCallback(
    (e: Event) => {
      if (e.target !== currentDropTarget) {
        setDropTgt(e.target! as HTMLElement);
      }
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

  useEffect(() => {
    setDropMap(utils.drawDndTargetMap(dropRef.current! as HTMLElement, 0));
  }, []);

  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('dragover', (e: Event) => e.preventDefault());
    return () => dropzoneRef.removeEventListener('dragover', (e: Event) => e.preventDefault());
  }, []);

  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('dragenter', initiateDropInfo);
    return () => dropzoneRef.removeEventListener('dragenter', initiateDropInfo);
  }, [initiateDropInfo]);

  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('drop', runDropHandler);
    dropzoneRef.addEventListener('click', initiateDropInfo);
    return () => dropzoneRef.removeEventListener('drop', runDropHandler);
  }, [runDropHandler]);

  return [dropRef, dropInfo, __DebugLastdropResult];
}
