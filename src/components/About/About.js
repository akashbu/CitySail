// Import React and required components
import React from 'react'; 
import Marquee from "react-fast-marquee";
import img1 from "../../image/keshav.jpg";
import img2 from "../../image/vedita.jpg";
import img3 from "../../image/aakash.png";
import img4 from "../../image/vaishnavi.jpg";
import img5 from "../../image/navya.png";
import img6 from "../../image/nikhil.jpg";
import img7 from "../../image/preetham.jpg";
import img8 from "../../image/mourya.png";
import './About.css';

// Functional component for the About page
const About = () => { 
  return ( 
    // Main container for the About page
    <div className="about-container">
      <div className="content">
        {/* Section for main content */}
        <h1>Meet Our Team</h1>
        <p>
          Welcome to our map navigation application! We are a dedicated team of developers and enthusiasts passionate about simplifying your journeys and optimizing your routes. Our mission is to provide you with a seamless navigation experience that takes the stress out of travel, whether it's for your daily commute or an exciting adventure.
        </p>
      </div>
      <div className="marquee">
        {/* Marquee for displaying images and profile information */}
        <Marquee gradient={true} pauseOnHover={true} delay={0} speed={100}>
          {/* Individual image and profile information */}
          <div className="image-wrapper">
            <img src={img1} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Keshav Daga</h1>
            </div>
          </div>
          {/* Repeat for other team members */}
          <div className="image-wrapper">
            <img src={img2} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Vedita Deshpande</h1>
            </div>
          </div>
          <div className="image-wrapper">
            <img src={img3} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Akash Butala</h1>
            </div>
          </div>
          <div className="image-wrapper">
            <img src={img4} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Vaishnavi More</h1>
            </div>
          </div>
          <div className="image-wrapper">
            <img src={img5} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Sri Sai Navya Manchikalapudi</h1>
            </div>
          </div>
          <div className="image-wrapper">
            <img src={img6} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Chathrapathi Nikhil Kandagatla</h1>
            </div>
          </div>
          <div className="image-wrapper">
            <img src={img7} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Hari Preetham Reddy Takuru</h1>
            </div>
          </div>
          <div className="image-wrapper">
            <img src={img8} height={300} width={300} alt="" />
            <div className="profile-info">
              <h1>Mourya Velampati </h1>
            </div>
          </div>
        </Marquee>
      </div>
    </div>
  ); 
}; 

// Export the About component
export default About;
