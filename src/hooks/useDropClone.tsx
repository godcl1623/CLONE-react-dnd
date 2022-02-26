import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BasicDndOptions, HandlerTemplate, CommonUtils } from '../components/CommonUtils';
import { setCurrentDropTarget, updateDropMap, __TESTAction__ } from '../actions';
import { RootState } from '../reducers';

export type IDropOptions = BasicDndOptions;

export default function useDropClone(option: IDropOptions): any {
  const currentDragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const [currentDropCategory, setDropCategory] = useState<any>(null);
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

  // const dropHandlerWrapper = useCallback(
  //   (e: Event) => {
  //     if (typeof currentDropCategory === 'string') {
  //       if (currentDropCategory === currentDragCategory) {
  //         if (dropHandler) {
  //           dropHandler(e);
  //         }
  //       }
  //     } else if (typeof currentDropCategory === 'object') {
  //       if ((currentDropCategory! as string[]).includes(currentDragCategory! as string)) {
  //         if (dropHandler) {
  //           dropHandler(e);
  //         }
  //       }
  //     }
  //   },
  //   [currentDragCategory, currentDropCategory]
  // );

  // useEffect(() => {
  //   const dropzoneRef = dropRef.current! as HTMLElement;
  //   // dropzoneRef.childNodes.forEach((child, idx) => {
  //   //   eventsList.forEach((evt, idx) => {
  //   //     child.addEventListener(evt, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
  //   //   });
  //   //   child.addEventListener('dragenter', (e: Event) => {
  //   //     setDropCategory((currentItemCategory! as string[])[idx]);
  //   //   });
  //   // });
  //   dropzoneRef.addEventListener('dragenter', (e: Event) => {
  //     dispatch(setCurrentDropTarget(e.target! as HTMLElement));
  //   })
  // }, []);
  // const drop = useSelector((state: RootState) => state.currentDropTarget)
  // useEffect(() => {
  //   const dropzoneRef = dropRef.current! as HTMLElement;
  //   dropzoneRef.addEventListener('dragenter', (e: Event) => {
  //     (e.target! as HTMLElement).style.background = 'black'
  //   })
  //   dropzoneRef.addEventListener('dragleave', (e: Event) => {
  //     (e.target! as HTMLElement).style.background = 'white'
  //   })
  // }, [drop])

  // useEffect(() => {
  //   const dropzoneRef = dropRef.current! as HTMLElement;
  //   if (currentDropCategory) {
  //     dropzoneRef.childNodes.forEach(child => child.addEventListener('drop', dropHandlerWrapper));
  //   }
  //   return () => {
  //     if (currentDropCategory) {
  //       dropzoneRef.childNodes.forEach(child => child.removeEventListener('drop', dropHandlerWrapper));
  //     }
  //   };
  // }, [dropHandlerWrapper]);

  useEffect(() => {
    if (dropRef.current) {
      dispatch(updateDropMap(utils.drawDropTargetMap(dropRef.current, 0)));
    }
  }, [dropRef.current]);
  const dropMap = useSelector((state: RootState) => state.dropMap);
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    eventsList.forEach((evt, idx) => {
      dropzoneRef.addEventListener(evt, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
    });
  }, []);
  const [currentDropLevel, setDropLevel] = useState<number | null>(null);
  const updateDropInfo = useCallback(
    (e: Event) => {
      if (dropMap) {
        const htmlTarget = e.target! as HTMLElement;
        const levelIncludesDropTarget = Object.values(dropMap).find(level => level.includes(htmlTarget))
        const levelOfDropTarget = Object.values(dropMap).indexOf(levelIncludesDropTarget! as HTMLElement[]);
        setDropLevel(levelOfDropTarget);
        const targetIdxInNodes = Array.from((htmlTarget.parentNode! as HTMLElement).childNodes).indexOf(htmlTarget);
        if (currentItemCategory) {
          setDropCategory((Object.values(currentItemCategory)[levelOfDropTarget])[targetIdxInNodes]);
        }
      }
    },
    [dropMap]
  );
  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.addEventListener('dragenter', updateDropInfo);
    return () => dropzoneRef.removeEventListener('dragenter', updateDropInfo);
  }, [updateDropInfo]);

  return [dropRef, currentDropLevel];
}
