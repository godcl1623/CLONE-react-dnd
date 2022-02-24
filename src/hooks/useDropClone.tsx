import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BasicDndOptions, HandlerTemplate } from '../components/CommonUtils';
import { __TESTAction__ } from '../actions';
import { RootState } from '../reducers';

export type IDropOptions = BasicDndOptions;

export default function useDropClone(option: IDropOptions): any {
  const currentDragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const [currentDropCategory, setDropCategory] = useState<string | string[] | null>(null);
  const dropRef = useRef(null);
  const eventsList = ['drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart'];
  const dispatch = useDispatch();

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

  const dropHandlerWrapper = useCallback(
    (e: Event) => {
      if (typeof currentDropCategory === 'string') {
        if (currentDropCategory === currentDragCategory) {
          if (dropHandler) {
            dropHandler(e);
          }
        }
      } else if (typeof currentDropCategory === 'object') {
        if ((currentDropCategory! as string[]).includes(currentDragCategory! as string)) {
          if (dropHandler) {
            dropHandler(e);
          }
        }
      }
    },
    [currentDragCategory, currentDropCategory]
  );

  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    dropzoneRef.childNodes.forEach((child, idx) => {
      eventsList.forEach((evt, idx) => {
        child.addEventListener(evt, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
      });
      child.addEventListener('dragenter', (e: Event) => {
        setDropCategory((currentItemCategory! as string[])[idx]);
      });
    });
  }, []);

  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    if (currentDropCategory) {
      dropzoneRef.childNodes.forEach(child => child.addEventListener('drop', dropHandlerWrapper));
    }
    return () => {
      if (currentDropCategory) {
        dropzoneRef.childNodes.forEach(child => child.removeEventListener('drop', dropHandlerWrapper));
      }
    };
  }, [dropHandlerWrapper]);

  return [dropRef, currentDropCategory];
}
