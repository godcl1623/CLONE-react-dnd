import { useState, useEffect, useRef } from 'react';
import { BasicDndOptions, HandlerTemplate, HandlerTemplateOptions } from '../components/CommonUtils';

export type IDragOptions = Omit<BasicDndOptions, 'dropHandler'>;

export default function useDragClone(option: IDragOptions) {
  const [isDraggable, makeDraggable] = useState(true);
  const dragTarget = useRef(null);
  const eventsList = ['drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart'];

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
  } = option;

  const handlerLists = [
    dragHandler,
    dragendHandler,
    dragenterHandler,
    dragexitHandler,
    dragleaveHandler,
    dragoverHandler,
    dragstartHandler,
  ];

  const templateOptions: HandlerTemplateOptions = {
    disablePreventDefault: true,
    disableStopPropagation: true,
  };

  useEffect(() => {
    const dragItems = dragTarget.current! as HTMLElement;
    if (!disableParent && !applyToChildren) {
      dragItems.draggable = isDraggable;
      eventsList.forEach((event, idx) => {
        dragItems.addEventListener(
          event,
          (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
        );
      });
    } else {
      dragItems.childNodes.forEach(item => {
        const HTMLItem = item as HTMLElement;
        HTMLItem.draggable = isDraggable;
        eventsList.forEach((evt, idx) => {
          HTMLItem.addEventListener(
            evt,
            (e: Event) => new HandlerTemplate(e, handlerLists[idx]! as () => void, templateOptions)
          );
        });
      });
    }
  }, [isDraggable]);

  return [dragTarget];
}
