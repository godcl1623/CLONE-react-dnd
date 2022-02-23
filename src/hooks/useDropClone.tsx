import { useEffect, useRef, useState } from 'react';
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
    dropHandler
  ];

  useEffect(() => {
    const dropzoneRef = dropRef.current! as HTMLElement;
    if (disableParent && applyToChildren) {
      dropzoneRef.childNodes.forEach((child, idx) => {
        eventsList.forEach((event, idx) => {
          child.addEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
        });
        child.addEventListener('dragenter', (e: Event) => {
          setDropCategory((currentItemCategory! as string[])[idx]);
        });
        // if (currentDragCategory === (currentItemCategory! as string[])[idx]) {
        child.addEventListener('drop', (e: Event) => {
          if (dropHandler) {
            const condA = typeof (currentItemCategory! as string[])[idx] === 'string' && currentDragCategory === (currentItemCategory! as string[])[idx];
            const condB = typeof (currentItemCategory! as string[])[idx] !== 'string' && (currentItemCategory! as string[])[idx].includes(currentDragCategory! as string);
            if (condA || condB) {
              console.log((currentItemCategory! as string[])[idx])
              dropHandler(e);
            } 
          }
        });
        // }
      });
      return () =>
        dropzoneRef.childNodes.forEach((child, idx) => {
          eventsList.forEach((event, idx) => {
            child.removeEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
          });
          child.removeEventListener('dragenter', (e: Event) => {
            setDropCategory((currentItemCategory! as string[])[idx]);
          });
          if (currentDragCategory === (currentItemCategory! as string[])[idx]) {
            child.removeEventListener('drop', (e: Event) => {
              if (dropHandler) {
                dropHandler(e);
              }
            });
          }
        });
      // eslint-disable-next-line no-else-return
    } else {
      eventsList.forEach((event, idx) => {
        dropzoneRef.addEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
      });
      dropzoneRef.addEventListener('dragenter', (e: Event) => {
        setDropCategory((currentItemCategory! as string[])[0]);
      });
      if (currentDragCategory === (currentItemCategory! as string[])[0]) {
        dropzoneRef.addEventListener('drop', (e: Event) => {
          if (dropHandler) {
            dropHandler(e);
          }
        })
      }
      return () => {
        eventsList.forEach((event, idx) => {
          dropzoneRef.removeEventListener(
            event,
            (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void)
          );
        });
        dropzoneRef.removeEventListener('dragenter', (e: Event) => {
          setDropCategory((currentItemCategory! as string[])[0]);
        });
        if (currentDragCategory === (currentItemCategory! as string[])[0]) {
          dropzoneRef.removeEventListener('drop', (e: Event) => {
            if (dropHandler) {
              dropHandler(e);
            }
          })
        }
      }
    }
  }, [currentDragCategory]);

  return [dropRef, currentDropCategory];
}
