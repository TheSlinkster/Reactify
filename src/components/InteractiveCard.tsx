import React from 'react';
import '../styles/InteractiveCard.css';

type InteractiveCardProps = {
  frontText: string;
  backText: string;
  frontColor?: string; // Optional custom color for the front
  backColor?: string;  // Optional custom color for the back
};

const InteractiveCard: React.FC<InteractiveCardProps> = ({ frontText, backText }) => {
  return (
    <div className="card">
      <div className="card-inner">
        {/* Front of the card */}
        <div className="card-front">
          <h2>{frontText}</h2>
        </div>
        {/* Back of the card */}
        <div className="card-back">
          <p>{backText}</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCard;
