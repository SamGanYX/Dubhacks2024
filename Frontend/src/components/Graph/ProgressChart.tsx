import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions, Chart, registerables, LinearScale } from 'chart.js'; // Import LinearScale
import './ProgressChart.css';
import {useAuth} from "../../AuthContext.tsx";

// Register the required components
Chart.register(...registerables, LinearScale); // Register LinearScale

interface DailyRecord {
    date: string;
    caloriesEaten: number;
    weight: number;
    calorieGoal: number;
}



export const calculateWeightLossBetweenExtremes = (records: DailyRecord[]): number => {
    if (records.length < 2) return 0; // Not enough data to calculate weight loss

    const oldestWeight = records[0].weight; // Weight of the oldest record
    const newestWeight = records[records.length - 1].weight; // Weight of the newest record
    return oldestWeight - newestWeight; // Calculate weight loss
};

export const calculateTimeRange = (records: DailyRecord[]): number => {
    if (records.length === 0) return 0;

    const oldestDate = new Date(records[0].date);
    const newestDate = new Date(records[records.length - 1].date);

    const durationInDays = Math.abs((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)); // Difference in days

    return durationInDays;
}


const ProgressChart = () => {
    const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
    const [calorieGoal, setCalorieGoal] = useState<number>(0); // State for calorie goal
    const [data, setData] = useState<DailyRecord[]>([]);
    const userID = localStorage.getItem("userID");
    const [averageWeightLoss, setAverageWeightLoss] = useState<number>(0); // State for average weight loss
    const [weightMessage, setWeightMessage] = useState<string>("");
    const [duration, setDuration] = useState<number>(0);
    const [adjustedCals, setAdjCals] = useState<number>(0)
    const { token } = useAuth();
    const [adjMessage] = useState<string>("Your New Suggested Calorie Intake: ");
    const [averageCaloriePercentage, setAverageCaloriePercentage] = useState<number>(0); // Store avg calorie %



    const groupByDate = (records: DailyRecord[]) => {
        const grouped: { [date: string]: { caloriesEaten: number, weight: number, caloriesGoal: number } } = {};

        records.forEach(record => {
            const splitDate = record.date.split("-");
            const noYear =splitDate[1] + "-" + splitDate[2];
            const date = noYear.split("T")[0];
            if (!grouped[date]) {
                grouped[date] = {
                    caloriesEaten: record.caloriesEaten,
                    weight: record.weight,
                    caloriesGoal: record.calorieGoal,
                };
            } else {
                grouped[date].caloriesEaten += record.caloriesEaten;
                grouped[date].weight = record.weight;
            }
        });

        return grouped;
    };

    const handleEditClick = () => {
        console.log(-(averageWeightLoss/(duration/7)))
        fetchAdjPlan();
    };

    const handleUpdateClick = () => {
        updateGoal();
    }

    const updateGoal = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/updateGoal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({goal: (adjustedCals), userID: userID}),
            });

            if (!response.ok) {
                throw new Error('');
            }
        } catch (err) {
            console.log(err);
        } finally {
        }
    };


    const fetchAdjPlan = async () => {
        try {
            console.log("average " + -(averageWeightLoss/(duration/7)))
            const response = await fetch('http://localhost:8081/api/adjust-diet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({actualWeightChangeRate: -(averageWeightLoss/(duration/7)), userID: userID}),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch diet plan');
            }

            const data = await response.json();
            setAdjCals(data);
        } catch (err) {
            console.log(err);
        } finally {
        }
    };
    useEffect(() => {
        fetch(`http://localhost:8081/api/dailyrecords/${userID}`)
            .then((res) => res.json())
            .then(async (data) => {
                setData(data);
                setAverageWeightLoss(Math.round(calculateWeightLossBetweenExtremes(data)*10)/10); // Calculate average weight loss
                setDuration(calculateTimeRange(data));
                console.log(averageWeightLoss)
                if (averageWeightLoss < 0) {
                    console.log("hi")
                    setWeightMessage("Your Overall Weight Gain:");
                    console.log(weightMessage)
                } else {
                    setWeightMessage("Your Overall Weight Loss:");
                    console.log("bye")
                }
            })
            .catch((err) => console.log(err));
    }, [userID]);

    useEffect(() => {
        if (averageWeightLoss < 0) {
            setWeightMessage("Your Overall Weight Gain:");
        } else {
            setWeightMessage("Your Overall Weight Loss:");
        }
    }, [averageWeightLoss]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const records = data;

                const groupedRecords = groupByDate(records);
                let avgPercent = 0;
                let counter = 0;
                for(const date in groupedRecords){
                    avgPercent += (groupedRecords[date].caloriesEaten/groupedRecords[date].caloriesGoal)*100;
                    counter++;
                }
                if(counter != 0) {
                    setAverageCaloriePercentage(Math.round(Math.min(avgPercent/counter, 200-avgPercent/counter)));
                }
                const labels = Object.keys(groupedRecords);
                const weightData = labels.map(date => groupedRecords[date].weight);
                const calorieData = labels.map(date => groupedRecords[date].caloriesEaten);
                const calorieGoalData = labels.map(date => groupedRecords[date].caloriesGoal);
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
                            data: (calorieGoalData),
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
        <div>
            <div className="chart-container">
                <h2 className="chart-title">Progress Over Time</h2>
                {chartData ? (
                    <Line data={chartData} options={options}/>
                ) : (
                    <p className="loading-message">Loading chart...</p>
                )}
            </div>
            <div className="wl-results">{weightMessage} {Math.abs(averageWeightLoss)} kg in {duration} days!
                <div >Your accuraccy towards your calorie goal was {averageCaloriePercentage}%</div>
                <p></p>
                <p>
                    <button onClick={handleEditClick} className={"btn-recalibrate"}>
                        Recalibrate Diet
                    </button>
                </p>

                <div>{adjustedCals != 0 && (adjMessage + adjustedCals)}</div>
                <p></p>
                {adjustedCals != 0 && (

                    <button onClick={handleUpdateClick} className={"btn-recalibrate"}>
                        Save New Goal
                    </button>
                )}
                <p></p>

            </div>

        </div>
    );
};

export default ProgressChart;
