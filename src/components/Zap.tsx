import React, { useEffect, useState } from 'react';

type ZapProps = {
  direction: 'clockwise' | 'counterclockwise';
};

type TrailSegment = {
  id: number;
  x: number;
  y: number;
};

const Zap: React.FC<ZapProps> = ({ direction }) => {
  const [trail, setTrail] = useState<TrailSegment[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Simulate zap movement and generate trail
    const interval = setInterval(() => {
      setPosition((prev) => {
        const newX = prev.x + (direction === 'clockwise' ? 5 : -5); // Adjust movement
        const newY = prev.y + (direction === 'clockwise' ? 3 : -3);

        // Add a new trail segment
        setTrail((prevTrail) => [
          ...prevTrail,
          { id: Date.now(), x: newX, y: newY },
        ]);

        return { x: newX, y: newY };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    // Remove old trail segments after a short duration
    const cleanup = setInterval(() => {
      setTrail((prevTrail) => prevTrail.filter((segment) => Date.now() - segment.id < 500));
    }, 50);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {/* Render the zap */}
      <div
        className="zap"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
        }}
      ></div>

      {/* Render the trail */}
      {trail.map((segment) => (
        <div
          key={segment.id}
          className="zap-trail"
          style={{
            top: `${segment.y}px`,
            left: `${segment.x}px`,
          }}
        ></div>
      ))}
    </>
  );
};

export default Zap;
