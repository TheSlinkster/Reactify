import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAccount, selectStatus, selectError } from '../slices/mySlice';
import { AppDispatch } from '../store';

const CreateAccountForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createAccount({ username, password }));
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating...' : 'Create'}
        </button>
      </form>
      {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default CreateAccountForm;
