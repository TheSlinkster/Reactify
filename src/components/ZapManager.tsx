import React, { useEffect, useState } from 'react';
import Zap from './Zap';

type Direction = 'clockwise' | 'counterclockwise';

const ZapManager: React.FC = () => {
  const [zaps, setZaps] = useState<{ id: number; direction: Direction }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (zaps.length < 4) {
        const newZap = {
          id: Date.now(),
          direction: (Math.random() > 0.5 ? 'clockwise' : 'counterclockwise') as Direction,
        };
        setZaps((prevZaps) => [...prevZaps, newZap]);

        setTimeout(() => {
          setZaps((prevZaps) => prevZaps.filter((zap) => zap.id !== newZap.id));
        }, 4000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [zaps]);

  return (
    <>
      {zaps.map((zap) => (
        <Zap key={zap.id} direction={zap.direction} />
      ))}
    </>
  );
};

export default ZapManager;
