import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './Workout.css';

interface Workout {
    ID: number;
    userID: number;
    place: string;
    workoutName: string;
    exercises: string;
    instructions: string;
    dateGenerated: string;
}

const Workouts = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // State to track total pages
    const userID = localStorage.getItem("userID");
    const navigate = useNavigate(); // Initialize useNavigate
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setLoading(false);
      if (!loading && !isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, navigate, loading]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/workouts/${userID}?page=${currentPage}`);
                const data = await response.json();

                if (Array.isArray(data.workouts)) {
                    setWorkouts(data.workouts);
                    setTotalPages(data.totalPages); // Set total pages from the response
                } else {
                    console.error('Fetched data is not an array:', data.workouts);
                }
            } catch (error) {
                console.error('Error fetching workouts:', error);
            }
        };

        fetchWorkouts();
    }, [currentPage, userID]);

    return (
        <div className="workouts-container">
            <h1>Your Workouts</h1>
            {workouts.length > 0 ? (
                <ul className='workouts_ul'>
                    {workouts.map((workout) => (
                        <li key={workout.ID} className="rec-container">
                            <h2 className="title-container">{workout.workoutName}</h2>
                            <p>Place: {workout.place}</p>
                            <p>Exercises: {workout.exercises}</p>
                            <p>Instructions: {workout.instructions}</p>
                            <p>Date Generated: {new Date(workout.dateGenerated).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No workouts found.</p>
            )}
            {/* Navigation Buttons */}
            <div className="navigation">
                {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                )}
                {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                )}
            </div>

            <button onClick={() => navigate('/generateWorkout/')} className="navigationbutton">
                Go to generate workout
            </button>
        </div>
    );
};

export default Workouts;
