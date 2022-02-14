import React from 'react';

interface AcceptProps {
  children?: React.ReactNode;
}

export default function ApplyDnd({ children }: AcceptProps): JSX.Element {
  const dropZone = document.querySelector('#dropzone')! as HTMLDivElement;
  const dragItems = document.querySelectorAll('.item');
  const [test, setTest] = React.useState(false);

  React.useEffect(() => {
    if (dropZone === null) {
      setTest(true);
    }
  }, []);

  React.useEffect(() => {
    if (dropZone) {
      dropZone.addEventListener('drop', () => alert('foo'));
      dropZone.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
      })
  
      return () => {
        dropZone.removeEventListener('drop', () => alert('foo'));
        dropZone.removeEventListener('dragover', (e: DragEvent) => {
          e.preventDefault();
        })
      };
    }
  }, [test]);

  React.useEffect(() => {
    dragItems.forEach(item => {
      (item as HTMLElement).draggable = true;
    });
  }, [test]);

  return (
    <React.Fragment>
      { children }
    </React.Fragment>
  );
}
