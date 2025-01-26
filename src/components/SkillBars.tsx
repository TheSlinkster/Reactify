import React from 'react';
import '../styles/SkillBars.css';

const skills = [
  { name: 'React', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'CSS', level: 80 },
];

const SkillBars: React.FC = () => {
  return (
    <div className="skills-container">
      {skills.map((skill, index) => (
        <div key={index} className="skill">
          <span>{skill.name}</span>
          <div className="skill-bar">
            <div
              className="skill-bar-fill"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillBars;
