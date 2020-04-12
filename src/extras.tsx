import * as React from 'react';

export const requesterLink = (requesterId: string, linkText: string) => {
  return (
    <a
      style={{color: 'inherit'}}
      href={`https://worker.mturk.com/requesters/${requesterId}/projects`}
      target="_blank"
    >
      {linkText}
    </a>
  );
};
