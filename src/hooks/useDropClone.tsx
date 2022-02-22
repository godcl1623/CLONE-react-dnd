import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BasicDndOptions, HandlerTemplate } from '../components/CommonUtils';
import { updateDropCategory, __TESTAction__ } from '../actions';
import { RootState } from '../reducers';

export type IDropOptions = BasicDndOptions;

export default function useDropClone(option: IDropOptions) {
  const currentDragCategory = useSelector((state: RootState) => state.currentDragCategory);
  const currentDropCategory = useSelector((state: RootState) => state.currentDropCategory);
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
      dropzoneRef.childNodes.forEach(child => {
        eventsList.forEach((event, idx) => {
          child.addEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
        });
        currentItemCategory?.forEach(category => {
          (child! as HTMLElement).dataset.type = category;
        });
        child.addEventListener('dragover', (e: Event) => {
          dispatch(updateDropCategory((child! as HTMLElement).dataset.type! as string))
        })
        if (currentDragCategory === currentDropCategory) {
          child.addEventListener('drop', (e: Event) => {
            if (dropHandler) {
              dropHandler(e);
            }
          })
        }
      });
      return () =>
        dropzoneRef.childNodes.forEach(child => {
          eventsList.forEach((event, idx) => {
            child.removeEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
          });
          currentItemCategory?.forEach(category => {
            (child! as HTMLElement).dataset.type = category;
          });
          child.removeEventListener('dragover', (e: Event) => {
            dispatch(updateDropCategory((child! as HTMLElement).dataset.type! as string))
          })
          if (currentDragCategory === currentDropCategory) {
            child.removeEventListener('drop', (e: Event) => {
              if (dropHandler) {
                dropHandler(e);
              }
            })
          }
        });
      // eslint-disable-next-line no-else-return
    } else {
      dropzoneRef.dataset.type = (currentItemCategory! as string[])[0];
      eventsList.forEach((event, idx) => {
        dropzoneRef.addEventListener(event, (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void));
      });
      dropzoneRef.addEventListener('dragenter', (e: Event) => {
        dispatch(updateDropCategory(dropzoneRef.dataset.type! as string));
      });
      if (currentDragCategory === currentDropCategory) {
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
          dispatch(updateDropCategory(dropzoneRef.dataset.type! as string));
        });
        if (currentDragCategory === currentDropCategory) {
          dropzoneRef.removeEventListener('drop', (e: Event) => {
            if (dropHandler) {
              dropHandler(e);
            }
          })
        }
      }
    }
  }, [currentDragCategory]);

  return [dropRef];
}
