import React from 'react';

interface AcceptProps {
  children?: React.ReactNode;
}

export default function ApplyDnd({ children }: AcceptProps): JSX.Element {
  return (
    <React.Fragment>
      { children }
    </React.Fragment>
  );
}
