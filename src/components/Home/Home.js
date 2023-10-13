import React, { useState, useEffect } from 'react';
import backgroundImage from '../../image/map.jpeg';

const Home = () => {
  const textLines = ['Navigate through the shortest path!!', 'Discover new routes!!', 'Reach your destination faster!!'];
  const typingSpeed = 50; // Speed in milliseconds between each letter
  const lineChangeDelay = 1000; // Delay between lines

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    let intervalId;

    const typeText = () => {
      intervalId = setInterval(() => {
        if (currentIndex <= textLines[currentLineIndex].length) {
          setCurrentText(textLines[currentLineIndex].slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setTimeout(() => {
            setCurrentText('');
            currentIndex = 0;
            setCurrentLineIndex((prevIndex) => (prevIndex + 1) % textLines.length);
            typeText(); // Restart the typing animation
          }, lineChangeDelay);
        }
      }, typingSpeed);
    };

    typeText();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [currentLineIndex]);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backdropFilter: 'blur(10px)', // Adjust the blur amount as needed
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '85vh',
    color: 'white', // Adjust the text color based on the background image
  };

  const textBoxStyle = {
    padding: '20px',
    border: '2px solid white', // Border style
    borderRadius: '10px', // Border radius for rounded corners
    background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background color
  };

  return (
    <div style={backgroundStyle}>
      <div style={textBoxStyle}>
        <h1>{currentText}</h1>
      </div>
    </div>
  );
};

export default Home;
