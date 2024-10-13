// Logger.tsx
import React, { useState, useEffect } from "react";
import Calendar from 'react-calendar'; // Import the Calendar
import 'react-calendar/dist/Calendar.css'; // Import default styles for the Calendar
import './Logger.css'; // Update to your preferred CSS file
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

interface MealEntry {
  meal: string;
  calories: number;
}

interface CalorieEntries {
  [date: string]: MealEntry[];
}

interface Record {
  date: string;        // Date as a string, e.g., "2024-10-12T07:00:00.000Z"
  caloriesEaten: number; // Total calories consumed
  mealName: string
  weight: number;      // User's weight at the time (can be string if fetched from the database as string)
  calorieGoal: number; // Daily calorie goal
}

const Logger: React.FC = () => {
  const [meal, setMeal] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntries>({});
  const [calorieGoal, setCalorieGoal] = useState<number>(2000); // Default calorie goal
  const [weight, setWeight] = useState<number>(165); // Default weight
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMealLogged, setIsMealLogged] = useState<boolean>(false); // New state to track submission
  const [loading, setLoading] = useState(true);
  const userID = localStorage.getItem("userID");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, loading]);

  // Fetch user stats
  const fetchUserStats = async () => {
    if (userID) {
      try {
        const response = await fetch('http://localhost:8081/userstats/'+userID);
        if (!response.ok) {
          throw new Error('Failed to fetch user stats');
        }
        const stats = await response.json();
        // console.log(stats);
        setCalorieGoal(stats.CaloriesGoal);
        // Assuming the first user stat is for the logged-in user

        // setWeight(stats.Weight);
        if (stats.Weight) {
          setWeight(stats.Weight);
          // console.log(weight);
          // You can also get other stats if needed (height, age, etc.)
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    }
  };

  // Fetch daily records
  const fetchDailyRecords = async () => {
    if (userID) {
        try {
            const response = await fetch(`http://localhost:8081/api/dailyrecords/${userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch daily records');
            }
            const records = await response.json();
            // Assuming records is an array of entries
            setCalorieEntries((prevEntries) => {
                const newEntries = { ...prevEntries }; // Create a copy of the previous entries

                records.forEach((record: Record) => {
                    const dateKey = formatDate(new Date(record.date)); // Extract and format date
                    // Initialize if dateKey doesn't exist
                    if (!newEntries[dateKey]) {
                        newEntries[dateKey] = [];
                    }
                    // Check if the record already exists to avoid duplicates
                    const exists = newEntries[dateKey].some(
                        (entry) => entry.meal === record.mealName && entry.calories === record.caloriesEaten
                    );

                    // Only add if it doesn't exist
                    if (!exists) {
                        newEntries[dateKey].push({ meal: record.mealName, calories: record.caloriesEaten });
                    }
                });

                return newEntries; // Return updated entries
            });
        } catch (error) {
            console.error('Error fetching daily records:', error);
        }
    }
  };


  useEffect(() => {
    fetchUserStats(); // Fetch user stats on component mount
    fetchDailyRecords(); // Fetch daily records on component mount
  }, [userID]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };
  
  const getTileClassName = ({ date }: { date: Date }): string => {
    const dateKey = formatDate(date);
    const totalCalories = getTotalCalories(dateKey);
  
    if (totalCalories === 0) {
      return 'tile-no-calories'; // Class for no calories logged
    } else if (totalCalories < calorieGoal * 0.5) {
      return 'tile-under-goal'; // Class for under 50% of the goal
    } else if (totalCalories < calorieGoal) {
      return 'tile-under-100'; // Class for under the goal
    } else {
      return 'tile-over-goal'; // Class for meeting/exceeding the goal
    }
  };  

  const handleCalendarChange = (date: Date) => {
    setSelectedDate(date); // Set selected date
    setIsModalOpen(true); // Open modal when a date is selected
    setIsMealLogged(false); // Reset meal logged state
  };

  const setDailyRecord = async () => {
    if (userID) {
      try {
        const dateKey = formatDate(selectedDate);
        const totalCalories = getTotalCalories(dateKey);

        const response = await fetch('http://localhost:8081/api/dailyrecords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID,
            date: dateKey,
            caloriesEaten: parseInt(calories), // Add the new meal calories
            mealName: meal,
            weight: weight, // Use the fetched weight
            calorieGoal, // You may want to adjust how you set the calorie goal
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to log daily record');
        }

        const result = await response.json();
        console.log(result); // Log success message
      } catch (error) {
        console.error('Error logging daily record:', error);
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meal || !calories) return;

    // Log the daily record to the database
    setDailyRecord();

    // Add the meal and calories to the selected date
    const dateKey = formatDate(selectedDate);
    setCalorieEntries((prevEntries) => ({
      ...prevEntries,
      [dateKey]: [
        ...(prevEntries[dateKey] || []),
        { meal, calories: parseInt(calories) },
      ],
    }));

    // Clear form fields but keep the modal open
    setMeal('');
    setCalories('');
    setIsMealLogged(true); // Set meal logged state to true
  };

  const getTotalCalories = (dateKey: string): number => {
    if (!calorieEntries[dateKey]) return 0;
    return calorieEntries[dateKey].reduce((total, entry) => total + entry.calories, 0);
  };

  const getProgressPercentage = (): number => {
    const dateKey = formatDate(selectedDate); // Get the key for the selected date
    const totalCalories = getTotalCalories(dateKey); // Get total calories for that date
    return Math.min((totalCalories / calorieGoal) * 100, 100); // Calculate percentage
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days); // Increment/Decrement date
    setSelectedDate(newDate);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  const tileContent = ({ date, view }: any) => {
    if (view === 'month') {
      const dateKey = formatDate(date);
      const totalCalories = getTotalCalories(dateKey);
      return (
        <div className="calendar-day-content">
          <span>{totalCalories} calories</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="logger">
      {/* Full-Screen Calendar Display */}
      <div className="calendar-container">
      <Calendar
        onChange={handleCalendarChange}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={getTileClassName} // Set class name dynamically for each tile
        maxDate={new Date()} // Optional: prevent future dates
      />
      </div>

      {/* Popup Modal for Meal Input Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <div className="date-navigator">
              <button onClick={() => changeDate(-1)}>←</button>
              <span>{formatDate(selectedDate)}</span>
              <button onClick={() => changeDate(1)}>→</button>
            </div>
            <div className="calorie-goal">
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${getProgressPercentage()}%` }}></div>
              </div>
              <h2>Total Calories: {getTotalCalories(formatDate(selectedDate))} / {calorieGoal} kcal</h2>
            </div>

            {/* Meal Input Form */}
            <form onSubmit={handleSubmit} className="meal-form">
              <div className="form-group-logger">
                <label>Meal Name: </label>
                <input
                  type="text"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  placeholder="Enter meal"
                />
              </div>
              <div className="form-group-logger">
                <label>Calories: </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Enter calories"
                />
              </div>
              <div className="form-group-logger">
                <label>Weight: </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                />
              </div>
              <button type="submit" className="btn-add-meal">Add Meal</button>
            </form>


            {/* Display Meals for Selected Date */}
            <div className="meal-list">
              <h4>Meals for {formatDate(selectedDate)}</h4>
              <ul>
                {calorieEntries[formatDate(selectedDate)] &&
                  calorieEntries[formatDate(selectedDate)].map((entry, index) => (
                    <li key={index}>
                      {entry.meal} - {entry.calories} kcal
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logger;
