
import HeroSection from '../components/HeroSection';
import InteractiveCard from '../components/InteractiveCard';
//import SkillBars from '../components/SkillBars';
import '../styles/Home.css'; // Optional styling for layout
import { motion } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import SkillCard from '../components/SkillCard';

const Home: React.FC = () => {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(() => {
        // Retrieve volume from localStorage or set default to 50%
        const savedVolume = localStorage.getItem('volume');
        return savedVolume ? parseFloat(savedVolume) : 0.5;
    });
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume; // Set initial volume from state
            // Attempt to autoplay
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(() => {
                    setIsPlaying(false);
                });
        }
    }, [volume]);

    // Save volume to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('volume', volume.toString());
    }, [volume]);

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isMuted) {
                audio.volume = volume; // Restore previous volume
            } else {
                audio.volume = 0; // Set volume to 0
            }
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        const audio = audioRef.current;
        if (audio) {
            audio.volume = newVolume;
        }
        setIsMuted(false); // Ensure mute is off when volume changes
    };
    const skills = [
        {
            skillName: 'React Development',
            description: 'Building interactive and dynamic user interfaces with React.',
            stats: [
                { label: 'Proficiency', value: '95%' },
                { label: 'Experience', value: '4 years' },
                { label: 'Projects', value: 25 },
            ],
            icon: '/assets/Reactjoo.png', // Replace with your icon path
        },
        {
            skillName: 'Technical Problem Solving',
            description: 'Analyzing and solving complex programming challenges.',
            stats: [
                { label: 'Proficiency', value: '90%' },
                { label: 'Experience', value: '5 years' },
                { label: 'Challenges Solved', value: 50 },
            ],
            icon: '/assets/problem.png', // Replace with your icon path
        },
        {
            skillName: 'CSS Mastery',
            description: 'Crafting beautiful, responsive, and modern web designs.',
            stats: [
                { label: 'Proficiency', value: '85%' },
                { label: 'Experience', value: '3 years' },
                { label: 'Designs Created', value: 15 },
            ],
            icon: '/assets/cssart.png', // Replace with your icon path
        },
    ];


    return (
        <div className="home">
            <header className="cyberpunk-header">

                <audio ref={audioRef} loop autoPlay>
                    <source src="/assets/MManEXE.mp3" type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
                <div className="audio-controls">
                    <ThemeToggle />
                    {/* Play/Pause Button */}
                    <button onClick={toggleAudio} className="audio-control">
                        {isPlaying ? 'Pause Music' : 'Play Music'}
                    </button>

                    {/* Volume Slider */}
                    <div className="volume-container">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                        <div className="volume-tooltip">{`${Math.round(
                            (isMuted ? 0 : volume) * 100
                        )}%`}</div>
                    </div>

                    {/* Mute Button */}
                    <button onClick={toggleMute} className="mute-control">
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
            </header>
            <motion.div
                className="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <HeroSection />
                <div className="portfolio-showcase">
                    <h2>Recent Projects</h2>
                    <div className="card-container">
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <InteractiveCard
                                frontText="Taby - Wadgering Assistant"
                                backText="A cutting edge race prediciton tool which leverages an original proprietry algorithim set to re define data science"
                            />
                            <InteractiveCard
                                frontText="Home Automation - Ongoing Passion"
                                backText="Utilizing everything from AI integration to the smallest Micro Processors I live for the opportunity to automate my own home"
                            />
                            <InteractiveCard
                                frontText="Master Remote - Reinventing The Universal Remote"
                                backText="Solving some of the fundemental problems with current Universal Remote Designs"
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1>Character Skills and Abilities</h1>
                    {skills.map((skill, index) => (
                        <SkillCard
                            key={index}
                            skillName={skill.skillName}
                            description={skill.description}
                            stats={skill.stats}
                            icon={skill.icon}
                        />
                    ))}
                </div>

            </motion.div>
        </div>

    );
};

export default Home;
