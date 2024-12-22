import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import ProgressChart from '../components/Graph/ProgressChart';
import './Plan.css';
import { useNavigate } from 'react-router-dom';
import './CalorieForm.css';


const Plan = () => {
    const [dietPlan, setDietPlan] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    // const [quote, setQuote] = useState('');
    // const [error, setError] = useState('');
    const [userData, setUserData] = useState<any>(null); // State to hold user data
    // const [caloriesGoal, setCalGoal] = useState<number>();
    const userID = localStorage.getItem("userID");
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
      setLoading(false);
      if (!loading && !isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, navigate, loading]);

    // const fetchQuote = async () => {
    //     setLoading(true);
    //     setError('');

    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getquote`);
    //         const data = await response.json();

    //         if (response.ok) {
    //             setQuote(data.quote);
    //         } else {
    //             setError(data.error || 'Failed to fetch quote.');
    //         }
    //     } catch (err) {
    //         setError('An error occurred while fetching the quote.');
    //     }
    // };
    // useEffect(() => {
    //     fetchQuote();
    // }, []);

    const fetchDietPlan = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/calculate-diet-with-bmr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({userID}),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch diet plan');
            }

            const data = await response.json();
            setDietPlan(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user data (daily records, calorie goal, etc.)
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dailyrecords/${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            const userData = await response.json();
            setUserData(userData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDietPlan();
        fetchUserData();
    }, [token]);

    const handleEditClick = () => {
        window.location.href = '/calculator'; // Redirect to /calculator with a page refresh
    };
    return (
        <div className="plan-container">
            {userData && (
                <div className="user-data">
                    <h3>Your Daily Records</h3>
                    <p>Caloric Goal: {userData.calorieGoal} kcal</p>
                    <p>Calories Eaten Today: {userData.caloriesEaten} kcal</p>
                    <p>Your Current Weight: {userData.weight} kg</p>
                </div>
            )}
            <button onClick={handleEditClick} className="btn-edit-info">Edit Personal Information</button>
            <h2>Your Diet Plan</h2>
            {dietPlan && (
                <div className="diet-results">
                    <h3>Expected Metabolic Rate: {dietPlan.bmr} kcal</h3>
                    <h3>Target Daily Caloric Intake: {dietPlan.dietResult} kcal</h3>
                    <div>{dietPlan.caloriesGoal != dietPlan.dietResult &&dietPlan.caloriesGoal != dietPlan.bmr && (
                        <h3>Adjusted Target Goal: {dietPlan.caloriesGoal}</h3>)}
                        </div>
                        {dietPlan.warning && <p className="warning">{dietPlan.warning}</p>}
                </div>
            )}
            <ProgressChart />

            {/* {error && <p className="error">{error}</p>} */}
            {/* {quote && <blockquote className="centered_bq">{quote}</blockquote>} */}
        </div>
    );
};

export default Plan;
