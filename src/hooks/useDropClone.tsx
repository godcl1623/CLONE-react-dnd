import { useEffect, useRef } from 'react';

export interface IDropOptions {
  disableParent?: boolean;
  applyToChildren?: boolean;
}

export default function useDropClone(option: IDropOptions) {
  const dropTarget = useRef(null);
  const { disableParent, applyToChildren } = option;

  useEffect(() => {
    const dropzoneRef = dropTarget.current! as HTMLElement;
    if (disableParent && applyToChildren) {
      dropzoneRef.childNodes.forEach(child => {
        child.addEventListener('drop', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          alert('foo')
        })
        child.addEventListener('dragover', (e: Event) => e.preventDefault());
      })
    } else {
      dropzoneRef.addEventListener('drop', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        alert('foo')
      });
      dropzoneRef.addEventListener('dragover', (e: DragEvent) => e.preventDefault());
    }

    return () => {
      dropzoneRef.removeEventListener('drop', () => alert('foo'));
      dropzoneRef.removeEventListener('dragover', (e: DragEvent) => e.preventDefault());
    }
  }, []);

  return [dropTarget];
}