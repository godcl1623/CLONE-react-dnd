import { useEffect, useRef } from 'react';

export default function useDropClone() {
  const dropContainer = useRef(null);

  useEffect(() => {
    const dropzoneRef = dropContainer.current! as HTMLElement;
    dropzoneRef.addEventListener('drop', () => alert('foo'));
    dropzoneRef.addEventListener('dragover', (e: DragEvent) => e.preventDefault());

    return () => {
      dropzoneRef.removeEventListener('drop', () => alert('foo'));
      dropzoneRef.removeEventListener('dragover', (e: DragEvent) => e.preventDefault());
    }
  }, []);

  return [dropContainer];
}