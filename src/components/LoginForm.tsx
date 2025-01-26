import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  refreshToken,
  selectToken,
  selectAuthStatus,
  selectAuthError,
} from '../slices/authSlice';
import { AppDispatch } from '../store';
import axios from 'axios';

const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(TOKEN_REFRESH_INTERVAL / 1000); // Countdown in seconds

  const dispatch: AppDispatch = useDispatch();
  const token = useSelector(selectToken); // Redux-managed token
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.taby.in/accounts/login', {
        username,
        password,
      });

      const { accessToken, refreshToken, accountId } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('accountId', accountId);

      // Dispatch the token to Redux state
      dispatch(refreshToken(accessToken));

      setDataChanged(true); // Indicate data change
      setTimeout(() => setDataChanged(false), 3000); // Reset data change indicator
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    // Clear tokens from local storage and Redux
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accountId');

    dispatch(refreshToken(null)); // Clear token in Redux state

    setDataChanged(true); // Indicate data change
    setTimeout(() => setDataChanged(false), 3000); // Reset data change indicator
  };

  useEffect(() => {
    // Synchronize localStorage with React state
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken !== token) {
      dispatch(refreshToken(storedToken)); // Update Redux state with stored token
    }
  }, [token, dispatch]);

  useEffect(() => {
    // Set up token refresh interval and countdown
    const interval = setInterval(async () => {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedRefreshToken) {
        try {
          const response = await axios.post('https://api.taby.in/accounts/refresh', {
            refreshToken: storedRefreshToken,
          });

          const { accessToken } = response.data;

          // Update the access token in local storage and Redux
          localStorage.setItem('accessToken', accessToken);
          dispatch(refreshToken(accessToken));

          setDataChanged(true);
          setTimeout(() => setDataChanged(false), 3000); // Reset data change indicator
          setRefreshCountdown(TOKEN_REFRESH_INTERVAL / 1000); // Reset countdown
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }, TOKEN_REFRESH_INTERVAL);

    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prev) => (prev > 0 ? prev - 1 : TOKEN_REFRESH_INTERVAL / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, [dispatch]);

  return (
    <div>
      <h2>Enter User Credentials</h2>
      <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>
      <form onSubmit={handleLogin}>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
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
        
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Token Status and Data Change Indicator */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            backgroundColor: token ? 'green' : 'red',
            border: '2px solid black',
          }}
        ></span>
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            color: token ? 'green' : 'red',
          }}
        >
          {token ? 'Token in Store' : 'No Token in Store'}
        </span>
      </div>

      {/* Countdown Timer */}
      {token && (
        <div style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
          Next token refresh in: {refreshCountdown} seconds
        </div>
      )}

      {/* Logout Button */}
      {token && (
        <button
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default LoginForm;
