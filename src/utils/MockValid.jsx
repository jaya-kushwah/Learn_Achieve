import React from 'react';

const MockValid = ({ message }) => {
  if (!message) return null;
  return (
    <small className="text-danger fw-semibold">
      {message}
    </small>
  );
};

export default MockValid;
