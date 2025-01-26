import React, { useState } from 'react';
import { ExampleForm } from '../components/ExampleForm';
import { ResponseDisplay } from '../components/ResponseDisplay';
import '../styles/SkillCard.css'
import LoginForm from '../components/LoginForm';
import ThemeToggle from '../components/ThemeToggle';

const ExamplesPage: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);

  const handleApiResponse = (data: string) => {
    setResponse(data);
  };

  return (
    <div style={{ padding: '20px' }}>
        <header><ThemeToggle/></header>
      <h1>Account Creation API Test</h1>
      <ExampleForm onApiResponse={handleApiResponse} />
      <ResponseDisplay response={response} />
    
        <div className='skill-card'>
            <div className='skill-description'>
            <h1>Token Storage and Refresh Test</h1>
            </div>
            <LoginForm />
        </div>
    </div>
  );
};

export default ExamplesPage;
