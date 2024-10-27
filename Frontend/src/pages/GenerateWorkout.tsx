import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // Assuming you have this context for authentication
import { useNavigate } from 'react-router-dom';
import "./GenerateWorkout.css";

const GenerateWorkout = () => {
    const [place, setPlace] = useState('');
    const [userStats, setUserStats] = useState<any>(null); // Will store the user's stats like ENDURANCE, MUSCLE, etc.
    
    const goal = localStorage.getItem("goal");
    const userID = localStorage.getItem("userID");
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }

        // Fetch user stats when the component mounts
        const fetchUserStats = async () => {
            try {
                const response = await fetch(`http://localhost:8081/userstats/${userID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log("User stats fetched:", data);
                setUserStats(data);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            }
        };

        fetchUserStats();
    }, [isAuthenticated, navigate, loading, userID]);

    // Function to fetch workouts based on user stats
    const getWorkouts = async () => {
        if (!userStats) {
            console.error('User stats not available');
            return;
        }

        const { ENDURANCE, MUSCLE, BMI, EATING, DAILY, UNKNOWN } = userStats;
        const formattedString = `UserID: ${userID}, Place: ${place}, Endurance: ${ENDURANCE}, Muscle: ${MUSCLE}, BMI: ${BMI}, Eating: ${EATING}, Daily: ${DAILY}, Unknown: ${UNKNOWN}`;
        console.log(formattedString);

        try {
            const response = await fetch(`http://localhost:8081/api/workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: formattedString }),
            });

            const data = await response.json();
            console.log(data);
            if (data.message === 'Workout inserted successfully.') {
                navigate('/workout');
            } else {
                console.error('Failed to insert workout into the database');
            }
        } catch (error) {
            console.error('Error fetching workout:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        getWorkouts(); // Call the getWorkouts function
    };

    return (
        <div className="generate-workout">
            <h1>Find Workouts by Location & Preferences</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Location:
                    <select 
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Location</option>
                        <option value="Classic Gym">Classic Gym</option>
                        <option value="Calisthenics Gym/playground">Calisthenics Gym/playground</option>
                        <option value="MMA Gym">MMA Gym</option>
                        {/* <option value="Home Gym">Home</option> */}
                    </select>
                </label>

                <br />

                <button type="submit" className="workoutbutton">Get Workouts</button>
            </form>
        </div>
    );
};

export default GenerateWorkout;
