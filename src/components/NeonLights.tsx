import React from 'react';
import '../index.css';

const NeonLights: React.FC = () => {
  const lights = [
    { top: '20%', left: '30%', color: 'pink' },
    { top: '50%', left: '60%', color: 'cyan' },
    { top: '70%', left: '40%', color: 'yellow' },
    { top: '10%', left: '80%', color: 'pink' },
    { top: '40%', left: '20%', color: 'cyan' },
  ];

  return (
    <>
      {lights.map((light, index) => (
        <div
          key={index}
          className={`neon-light ${light.color}`}
          style={{ top: light.top, left: light.left }}
        ></div>
      ))}
    </>
  );
};

export default NeonLights;
