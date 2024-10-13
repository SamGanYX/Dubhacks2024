import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart, registerables, LinearScale } from 'chart.js'; // Import LinearScale
import './ProgressChart.css';

// Register the required components
Chart.register(...registerables, LinearScale); // Register LinearScale

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

    const groupByDate = (records: DailyRecord[]) => {
        const grouped: { [date: string]: { caloriesEaten: number, weight: number } } = {};

        records.forEach(record => {
            const splitDate = record.date.split("-");
            const noYear =splitDate[1] + "-" + splitDate[2];
            const date = noYear.split("T")[0];
            if (!grouped[date]) {
                grouped[date] = {
                    caloriesEaten: record.caloriesEaten,
                    weight: record.weight,
                };
            } else {
                grouped[date].caloriesEaten += record.caloriesEaten;
                grouped[date].weight = record.weight;
            }
        });

        return grouped;
    };

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

                const groupedRecords = groupByDate(records);

                const labels = Object.keys(groupedRecords);
                const weightData = labels.map(date => groupedRecords[date].weight);
                const calorieData = labels.map(date => groupedRecords[date].caloriesEaten);

                const maxWeight = Math.max(...weightData);
                const weightAxisMax = maxWeight * 1.2;

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
                            label: 'Calorie Goal',
                            data: Array(labels.length).fill(calorieGoal),
                            borderColor: 'rgba(255, 215, 0, 1)',
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            borderDash: [5, 5],
                            yAxisID: 'y-axis-calories',
                        },
                    ],
                });

                setOptions({
                    scales: {
                        'y-axis-weight': {
                            type: 'linear',
                            position: 'left',
                            beginAtZero: true,
                            max: weightAxisMax,
                        },
                        'y-axis-calories': {
                            type: 'linear',
                            position: 'right',
                            beginAtZero: true,
                        },
                    },
                });
            } catch (error) {
                console.error('Error fetching daily records:', error);
            }
        };

        fetchData();
    }, [data, calorieGoal]);

    const [options, setOptions] = useState<ChartOptions<'line'>>({
        scales: {
            'y-axis-weight': {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
            },
            'y-axis-calories': {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
            },
        },
    });

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
