import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { ChartData, ChartOptions } from 'chart.js';
import './ProgressChart.css'; // Import the CSS file

interface DailyRecord {
    date: string;
    caloriesEaten: number;
    weight: number;
}

interface ProgressChartProps {
    userID: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ userID }) => {
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<DailyRecord[]>(`/api/dailyrecords/${userID}`);
                const records = response.data;

                const labels = records.map(record => record.date);
                const weightData = records.map(record => record.weight);
                const calorieData = records.map(record => record.caloriesEaten);

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
                    ],
                });
            } catch (error) {
                console.error('Error fetching daily records:', error);
            }
        };

        fetchData();
    }, [userID]);

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
