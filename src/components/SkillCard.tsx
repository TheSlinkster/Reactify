import React from 'react';
import '../styles/SkillCard.css';

type SkillCardProps = {
  skillName: string; // Name of the skill
  description: string; // What the skill is used for
  stats: { label: string; value: string | number }[]; // Array of stats
  icon: string; // Path to the skill's icon image
};

const SkillCard: React.FC<SkillCardProps> = ({ skillName, description, stats, icon }) => {
  return (
    <div className="skill-card">
      <div className="icon-container">
        <img src={icon} alt={`${skillName} icon`} className="skill-icon" />
      </div>
      <div className="skill-info">
        <h3 className="skill-name">{skillName}</h3>
        <p className="skill-description">{description}</p>
        <div className="skill-stats">
          {stats.map((stat, index) => (
            <div key={index} className="skill-stat">
              <span className="stat-label">{stat.label}:</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
