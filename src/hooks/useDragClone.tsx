import { useEffect, useRef } from 'react';

export default function useDragClone() {
  const itemContainer = useRef(null);

  useEffect(() => {
    const dragItems = (itemContainer.current! as HTMLElement).childNodes;
    dragItems.forEach(item => {
      (item as HTMLElement).draggable = true;
    });
  }, []);

  return [itemContainer];
}