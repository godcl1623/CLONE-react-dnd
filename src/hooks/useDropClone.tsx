import { useEffect, useRef } from 'react';
import { BasicDndOptions, HandlerTemplate } from '../components/CommonUtils';

export type IDropOptions = BasicDndOptions;

export default function useDropClone(option: IDropOptions) {
  const dropTarget = useRef(null);
  const eventsList = ['drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart', 'drop'];

  const {
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
    const dropzoneRef = dropTarget.current! as HTMLElement;
    if (disableParent && applyToChildren) {
      dropzoneRef.childNodes.forEach(child => {
        eventsList.forEach((event, idx) => {
          child.addEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
        });
      });
      return () =>
        dropzoneRef.childNodes.forEach(child => {
          eventsList.forEach((event, idx) => {
            child.removeEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
          });
        });
      // eslint-disable-next-line no-else-return
    } else {
      eventsList.forEach((event, idx) => {
        dropzoneRef.addEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
      });
      return () =>
        eventsList.forEach((event, idx) => {
          dropzoneRef.removeEventListener(
            event,
            (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void)
          );
        });
    }
  }, []);

  return [dropTarget];
}
