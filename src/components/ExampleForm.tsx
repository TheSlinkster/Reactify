import React, { useState } from 'react';
import axios from 'axios';

interface ExampleFormProps {
  onApiResponse: (data: string) => void;
}

export const ExampleForm: React.FC<ExampleFormProps> = ({ onApiResponse }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://api.taby.in/accounts/accounts/create', {
        username,
        password,
      });
      onApiResponse(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send data. Please try again.');
      console.error('Error details:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};
