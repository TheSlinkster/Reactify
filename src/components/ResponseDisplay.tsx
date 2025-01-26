import React from 'react';

interface ResponseDisplayProps {
  response: string | null;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px', width: '300px' }}>
      <h3>API Response:</h3>
      {response ? <pre>{response}</pre> : <p>No response yet.</p>}
    </div>
  );
};
