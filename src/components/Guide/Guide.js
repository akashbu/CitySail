import React from 'react';
import YouTube from 'react-youtube';
import './Guide.css';
const Guide = () => {
  // YouTube video options
  const videoOptions = {
    height: '800',
    width: '1200',
    playerVars: {
      autoplay: 0,
    },
  };

  // YouTube video ID extracted from the provided link
  const videoId = 'o2ZZx2WN-N0';

  return (
    <div className="guide-container">
      <div className="content">
        <h1>Watch out the YouTube tutorial for a step-by-step guide on how to run the application.</h1>
      </div>      
	  <div className="youtube-container">
        <YouTube videoId={videoId} opts={videoOptions} />
      </div>
    </div>
  );
};

export default Guide;
