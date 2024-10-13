import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { ChartData, ChartOptions, Chart, registerables } from 'chart.js'; // Import and register required components
import './ProgressChart.css'; // Import the CSS file

// Register the required components
Chart.register(...registerables);

interface DailyRecord {
    date: string;
    caloriesEaten: number;
    weight: number;
    calorieGoal: number;
}

const ProgressChart = () => {
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
    const [calorieGoal, setCalorieGoal] = useState<number>(0); // State for calorie goal
    const [data, setData] = useState<DailyRecord[]>([]);
    const userID = localStorage.getItem("userID");

    useEffect(() => {
        fetch(`http://localhost:8081/api/dailyrecords/${userID}`)
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            })
            .catch((err) => console.log(err));
    }, [userID]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const records = data;

                const labels = records.map(record => record.date);
                const weightData = records.map(record => record.weight);
                const calorieData = records.map(record => record.caloriesEaten);

                setCalorieGoal(records[records.length - 1]?.calorieGoal || 0);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Weight (kg)',
                            data: weightData,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            yAxisID: 'y-axis-weight',
                        },
                        {
                            label: 'Calories Eaten',
                            data: calorieData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            yAxisID: 'y-axis-calories',
                        },
                        {
                            label: 'Calorie Goal', // New dataset for the calorie goal
                            data: Array(records.length).fill(calorieGoal), // Flat line at the calorie goal
                            borderColor: 'rgba(255, 215, 0, 1)', // Color for the calorie goal line
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            borderDash: [5, 5], // Dashed line style
                            yAxisID: 'y-axis-calories',
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching daily records:', error);
            }
        };

        fetchData();
    }, [data, calorieGoal]);

    const options: ChartOptions<'line'> = {
        scales: {
            'y-axis-weight': {
                type: 'linear',
                position: 'left',
                beginAtZero: false,
            },
            'y-axis-calories': {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container">
            <h2 className="chart-title">Progress Over Time</h2>
            {chartData ? (
                <Line data={chartData} options={options} />
            ) : (
                <p className="loading-message">Loading chart...</p>
            )}
        </div>
    );
};

export default ProgressChart;
