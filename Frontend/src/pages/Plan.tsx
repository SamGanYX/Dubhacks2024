import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import ProgressChart from '../components/Graph/ProgressChart';

const Plan = () => {
    const { token } = useAuth();
    const [dietPlan, setDietPlan] = useState<any>(null); // Change `any` to a specific type if available
    const [loading, setLoading] = useState<boolean>(true);
    const [targetWeight, setTargetWeight] = useState<number>(70); // Default target weight
    const userID = localStorage.getItem("userID");

    // Fetch the diet plan from the backend
    const fetchDietPlan = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/api/calculate-diet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include token for authentication
                },
                body: JSON.stringify({ targetWeight, userID }),
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
    useEffect(() => {
        fetchDietPlan();
    }, [token, targetWeight]); // Re-fetch if the token, target weight, or target time changes

    return (
        <div className="plan-container">
            <h2>Your Diet Plan</h2>
            {loading && <p>Loading...</p>}
            {dietPlan && (
                <div className="diet-results">
                    <h3>Basal Metabolic Rate (BMR): {dietPlan.bmr} kcal</h3>
                    <h3>Total Daily Energy Expenditure (TDEE): {dietPlan.tdee} kcal</h3>
                    <h3>Target Daily Caloric Intake: {dietPlan.targetCalories} kcal</h3>
                    {dietPlan.warning && <p className="warning">{dietPlan.warning}</p>}
                </div>
            )}
            <div className="input-container">
                <h4>Adjust Your Target</h4>
                <label>
                    Target Weight (kg):
                    <input
                        type="number"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(Number(e.target.value))}
                    />
                </label>
                <button onClick={() => fetchDietPlan()}>Update Plan</button>
            </div>
            <ProgressChart></ProgressChart>
        </div>
    );
};

export default Plan;
