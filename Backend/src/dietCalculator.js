function calculateDiet(height, gender, weight, age, weightChangeRate, activity) {
    const heightCm = height;
    const weightKg = weight;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 0) {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === 1) {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Adjust for weight change goals
    const calorieAdjustment = (weightChangeRate / 7) * 700;
    const calorieGoal = (bmr * activity) + calorieAdjustment;

    return Math.round(calorieGoal);
}

function adjustDiet(height, gender, weight, age, weightChangeRate, activity, actualWeightChangeRate) {
    const heightCm = height;
    const weightKg = weight;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 0) {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else if (gender === 1) {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Adjust for weight change goals
    let calorieAdjustment = (weightChangeRate / 7) * 700;
    if (Math.abs(actualWeightChangeRate) < Math.abs(0.8 * weightChangeRate)) {
        calorieAdjustment = calorieAdjustment * (weightChangeRate / actualWeightChangeRate)
    }

    const calorieGoal = (bmr * activity) + calorieAdjustment;



    return Math.round(calorieGoal);
}
module.exports = {
    calculateDiet,
    adjustDiet,
    // ... other exports if needed
};