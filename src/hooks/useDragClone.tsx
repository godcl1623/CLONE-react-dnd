import { useState, useEffect, useRef } from 'react';

export default function useDragClone() {
  const [isDraggable, makeDraggable] = useState(true);
  const dragTarget = useRef(null);

  useEffect(() => {
    const dragItems = dragTarget.current! as HTMLElement;
    if (dragItems.children.length === 0) {
      dragItems.draggable = isDraggable;
    }
    dragItems.childNodes.forEach(item => {
      (item as HTMLElement).draggable = isDraggable;
    });
  }, [isDraggable]);

  return [dragTarget];
}