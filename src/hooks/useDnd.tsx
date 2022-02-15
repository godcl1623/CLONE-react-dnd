import React, { useEffect, useRef } from 'react';

export default function useDnd(dropTarget?: React.ReactNode, dragItems?: React.ReactNode[]) {
  const dropzone = useRef(null);
  const itemContainer = useRef(null);

  useEffect(() => {
    const dropzoneRef = dropzone.current! as HTMLElement;
    dropzoneRef.addEventListener('drop', () => alert('foo'));
    dropzoneRef.addEventListener('dragover', (e: DragEvent) => e.preventDefault());

    return () => {
      dropzoneRef.removeEventListener('drop', () => alert('foo'));
      dropzoneRef.removeEventListener('dragover', (e: DragEvent) => e.preventDefault());
    }
  }, []);

  useEffect(() => {
    const dragItems = (itemContainer.current! as HTMLElement).childNodes;
    dragItems.forEach(item => {
      (item as HTMLElement).draggable = true;
    });
  }, []);

  return [dropzone, itemContainer];
}