import React from 'react';
import './About.css'; // Make sure to create a CSS file for styling

const About = () => {
    return (
        <div className="about-container">
            <h1>About Our Fitness Nutrition App</h1>
            <p>
                Our Fitness Nutrition App is designed to empower individuals to take control of their health and nutrition. 
                We believe that nutrition is a vital component of fitness, and our app aims to simplify the process of tracking meals, 
                setting nutrition goals, and accessing valuable resources to support a healthy lifestyle.
            </p>
            
            <h2>Our Mission</h2>
            <p>
                Our mission is to make healthy eating accessible and enjoyable for everyone. 
                We strive to provide a user-friendly platform that promotes informed dietary choices 
                and helps users stay motivated on their fitness journeys.
            </p>
            
            <h2>Meet the Team</h2>
            <div className="team-members">
                <div className="team-member">
                    <h3>Jane Doe</h3>
                    <p>Co-Founder & Lead Developer</p>
                </div>
                <div className="team-member">
                    <h3>John Smith</h3>
                    <p>Co-Founder & Nutrition Expert</p>
                </div>
                <div className="team-member">
                    <h3>Alice Johnson</h3>
                    <p>UI/UX Designer</p>
                </div>
                <div className="team-member">
                    <h3>Bob Lee</h3>
                    <p>Backend Developer</p>
                </div>
            </div>
            
            <h2>Contact Us</h2>
            <p>If you have any questions, suggestions, or feedback, feel free to reach out to us!</p>
            <p>Email: <a href="mailto:support@fitnessnutritionapp.com">support@fitnessnutritionapp.com</a></p>

            <h2>Follow Us</h2>
            <p>Stay updated with our latest features and health tips on our social media:</p>
            <ul>
                <li><a href="https://www.facebook.com/fitnessnutritionapp" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                <li><a href="https://twitter.com/fitnessnutritionapp" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://www.instagram.com/fitnessnutritionapp" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
        </div>
    );
};

export default About;
