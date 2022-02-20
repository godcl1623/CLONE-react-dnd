import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BasicDndOptions, HandlerTemplate } from '../components/CommonUtils';
import { __TESTAction__ } from '../actions';
import { RootState } from '../reducers';

export type IDropOptions = BasicDndOptions;

export default function useDropClone(option: IDropOptions) {
  const _test = useSelector((state: RootState) => state.test);
  const dropTarget = useRef(null);
  const eventsList = ['drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart', 'drop'];
  const dispatch = useDispatch();

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
