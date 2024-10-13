import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./CalorieForm.css";

const CalorieForm = () => {
  // Form state for user inputs
  const [age, setAge] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [goal, setGoal] = useState<string>("gain muscle easy");
  const [activity, setActivity] = useState<string>("1.2");
  const [gender, setGender] = useState<number | "">(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { isAuthenticated, login, logout, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    setLoading(false);
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submit

    if (!userID) {
      setError("User is not logged in");
      return;
    }

    // Construct the data to be sent in the request
    const formData = {
      userID,
      age,
      height,
      weight,
      gender,
      goal,
      activity,
    };

    try {
      const response = await fetch("http://localhost:8081/userstats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token for authenticated request
        },
        body: JSON.stringify(formData), // Convert the data to JSON
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Stats added successfully!");
        setGoal("");
        setAge("");
        setWeight("");
        setHeight("");
        window.location.href = "/plan";
      } else {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
      }
    } catch (err) {
      setError("Failed to submit the data. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="form-card col-md-12">
      <h2>Calorie Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Age input */}
        <div className="form-group-calorie-form">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="form-control"
            required
          />
        </div>

        {/* Gender input */}
        <div className="form-group-calorie-form">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(parseInt(e.target.value))}
            className="form-control"
            required
          >
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>

        {/* Height input and slider */}
        <div className="form-group-calorie-form">
          <label htmlFor="height">Height (cm):</label>
          <div className="slider-container">
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="form-control"
              required
            />
            <input
              type="range"
              min="100"
              max="250"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="slider"
            />
          </div>
        </div>

        {/* Weight input and slider */}
        <div className="form-group-calorie-form">
          <label htmlFor="weight">Weight (kg):</label>
          <div className="slider-container">
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="form-control"
              required
            />
            <input
              type="range"
              min="30"
              max="250"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="slider"
            />
          </div>
        </div>

        {/* Goal dropdown */}
        <div className="form-group-calorie-form">
          <label htmlFor="goal">Goal:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="form-control"
            required
          >
            <option value="gain muscle easy">Gain Muscle (0.1 kg/week)</option>
            <option value="gain muscle hard">Gain Muscle (0.2 kg/week)</option>
            <option value="lose fat easy">Lose Fat (0.5 kg/week)</option>
            <option value="lose fat hard">Lose Fat (1.0 kg/week)</option>
            <option value="gain weight easy">Gain Weight (0.5 kg/week)</option>
            <option value="gain weight hard">Gain Weight (1.0 kg/week)</option>
            <option value="maintain weight">Maintain Weight (0.0 kg/week)</option>
          </select>
        </div>

        {/* Activity dropdown */}
        <div className="form-group-calorie-form">
          <label htmlFor="activity">Activity Level:</label>
          <select
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="form-control"
            required
          >
            <option value="1.2">Little or no exercise</option>
            <option value="1.375">Light exercise/sports 1-3 days/week</option>
            <option value="1.55">Moderate exercise/sports 3-5 days/week</option>
            <option value="1.725">Hard exercise/sports 6-7 days a week</option>
            <option value="1.9">Very hard exercise/sports & a physical job</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="form-group-calorie-form">
          <button type="submit" className="btn btn-primary button-calorie-form">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default CalorieForm;