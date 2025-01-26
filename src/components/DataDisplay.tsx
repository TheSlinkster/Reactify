import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccounts, selectStatus, selectError } from '../slices/mySlice'; // Adjust import path if needed
import { AppDispatch, RootState } from '../store';

interface Account {
  username: string;
  password: string;
}

const DataDisplay: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const accounts = useSelector((state: RootState) => selectAccounts(state));
  const status = useSelector((state: RootState) => selectStatus(state));
  const error = useSelector((state: RootState) => selectError(state));

  useEffect(() => {
    // Add logic for fetching accounts if needed
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <ul>
      {accounts.map((account: Account, index: number) => (
        <li key={index}>
          {account.username} (Index: {index})
        </li>
      ))}
    </ul>
  );
};

export default DataDisplay;
