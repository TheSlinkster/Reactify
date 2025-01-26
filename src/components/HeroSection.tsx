import React from 'react';
import Typewriter from 'typewriter-effect';
import '../styles/HeroSection.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
const HeroSection: React.FC = () => {
  return (
    
    <div className="hero-section">
      <div className="hero-content">
        <h1>
          <Typewriter
            options={{
              strings: ['Welcome to My Portfolio', 'Frontend React Developer', 'Innovative Web Creator'],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
        <h2>Explore my projects, skills, and creativity.</h2>
        <Link to="/desktop" className="hero-button">
          See My Work
        </Link>
      </div>
    </div>
    
  );
};

export default HeroSection;
