import React from 'react';
import './About.css'; // Make sure to create a CSS file for styling

const About = () => {
    return (
        <div className="about-container">
            <h2>Meet the Team</h2>
            <div className="team-members">
                <div className="team-member">
                    <h3>Brandon Leong</h3>
                </div>
                <div className="team-member">
                    <h3>Yunxin Gan</h3>
                </div>
                <div className="team-member">
                    <h3>Emily Feng</h3>
                </div>
                <div className="team-member">
                    <h3>Bijou Kim</h3>
                </div>
            </div>
            <h1>About TeenFitX</h1>
            <p>
                Our Fitness Nutrition App was inspired by the growing awareness of the crucial role nutrition plays in achieving fitness goals. 
                Many people struggle to navigate the overwhelming options for dietary information, so we set out to create an intuitive platform 
                that makes nutrition tracking simple while providing tools to help users reach their fitness objectives.
            </p>
            
            <h2>What It Does</h2>
            <p>
                Our app allows users to log their daily meals, track calorie intake, and set personalized nutrition goals. 
                It offers a database of healthy recipes tailored to various dietary preferences and visualizes progress through graphs and statistics. 
                Users can also connect with a community for support and motivation.
            </p>
            
            <h2>How We Built It</h2>
            <p>
                Our team used React, TypeScript, JavaScript, and Python to develop a functional, user-friendly platform. 
                We combined our skills to integrate backend and frontend features, ensuring smooth and efficient user experiences.
            </p>
            
            <h2>Challenges We Faced</h2>
            <p>
                We encountered challenges while learning new skills on the fly, adapting to hidden roadblocks, and meeting tight deadlines. 
                Despite this, our collaboration and perseverance helped us overcome these hurdles.
            </p>
            
            <h2>Accomplishments</h2>
            <p>
                We're proud of creating a viable product with a clean interface that simplifies meal logging and goal tracking. 
                The seamless integration of features allows users to engage meaningfully with the app and track their nutrition journey.
            </p>
            
            <h2>What We Learned</h2>
            <p>
                We learned the value of team collaboration and how diverse skills can foster creativity and problem-solving. 
                Clear documentation and code organization were crucial for a smooth development process, and pre-planning helped streamline our workflow.
            </p>
            
            <h2>What's Next</h2>
            <p>
                Looking ahead, we plan to expand the app's features to enhance the user experience, including integration with fitness devices like Apple Health. 
                We also aim to increase community engagement by introducing live interactions between users.
            </p>
        </div>
    );
};

export default About;
