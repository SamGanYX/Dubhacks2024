// Logger.tsx
import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import the Calendar
import 'react-calendar/dist/Calendar.css'; // Import default styles for the Calendar
import './Logger.css'; // Update to your preferred CSS file

interface MealEntry {
  meal: string;
  calories: number;
}

interface CalorieEntries {
  [date: string]: MealEntry[];
}

const Logger: React.FC = () => {
  const [meal, setMeal] = useState<string>('');
  const [calories, setCalories] = useState<string>('');
  const [calorieEntries, setCalorieEntries] = useState<CalorieEntries>({});
  const [calorieGoal, setCalorieGoal] = useState<number>(2000); // Default calorie goal
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  const handleCalendarChange = (date: Date) => {
    setSelectedDate(date); // Set selected date
    setIsModalOpen(true); // Open modal when a date is selected
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!meal || !calories) return;

    const dateKey = formatDate(selectedDate);

    // Add the meal and calories to the selected date
    setCalorieEntries((prevEntries) => ({
      ...prevEntries,
      [dateKey]: [
        ...(prevEntries[dateKey] || []),
        { meal, calories: parseInt(calories) },
      ],
    }));

    // Clear form fields
    setMeal('');
    setCalories('');
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
              <div className="form-group">
                <label>Meal Name: </label>
                <input
                  type="text"
                  value={meal}
                  onChange={(e) => setMeal(e.target.value)}
                  placeholder="Enter meal"
                />
              </div>
              <div className="form-group">
                <label>Calories: </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="Enter calories"
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
