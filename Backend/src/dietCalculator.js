const Gender = {
    Male: 'Male',
    Female: 'Female'
};

const CALORIES_PER_KG = 7700; // Calories needed to lose 1 kg of fat
const MIN_SAFE_CALORIES = 1200; // Minimum safe calorie intake
const DEFICIT_ADJUSTMENT = 100; // Adjustment for daily calorie deficit

// Activity level multipliers
const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    lightlyActive: 1.375, // Light exercise/sports 1-3 days/week
    moderatelyActive: 1.55, // Moderate exercise/sports 3-5 days/week
    veryActive: 1.725, // Hard exercise/sports 6-7 days a week
    extraActive: 1.9 // Very hard exercise/sports & a physical job
};

/**
 * Calculates the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 * @param {number} height - Height in centimeters.
 * @param {number} gender - Gender of the person.
 * @param {number} weight - Weight in kilograms.
 * @param {number} age - Age in years.
 * @returns {number} - The calculated BMR.
 */
function calculateBMR(height, gender, weight, age) {
    return gender === 0
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Calculates the Total Daily Energy Expenditure (TDEE).
 * @param {number} bmr - Basal Metabolic Rate.
 * @param {number} activityLevel - Activity level of the person.
 * @returns {number} - The calculated TDEE.
 */
function calculateTDEE(bmr, activityLevel) {
    const multiplier = activityLevel;
    return bmr * multiplier;
}

/**
 * Calculates the diet based on the provided parameters.
 * @param {number} height - The height of the person in centimeters.
 * @param {number} gender - The gender of the person.
 * @param {number} weight - The weight of the person in kilograms.
 * @param {number} age - The age of the person in years.
 * @param {number} targetWeight - The target weight of the person in kilograms.
 * @param {number} targetTime - The target time in weeks for the weight loss.
 * @param {string} activityLevel - Activity level of the person.
 * @returns {Object} - The calculated diet result.
 */
function calculateDiet(height, gender, weight, age, targetWeight, targetTime, activityLevel) {
    if (height <= 0 || weight <= 0 || age <= 0 || targetWeight <= 0 || targetWeight >= weight || targetTime <= 0) {
        throw new Error("Invalid input parameters. Ensure all values are positive and logically consistent.");
    }

    const bmr = calculateBMR(height, gender, weight, age);
    const tdee = calculateTDEE(bmr, activityLevel);
    const weightDifference = weight - targetWeight;
    const calorieDeficitNeeded = weightDifference * CALORIES_PER_KG;
    const dailyCalorieDeficit = calorieDeficitNeeded / (targetTime * 7);
    const targetCalories = tdee - dailyCalorieDeficit;

    let warning = "";
    if (dailyCalorieDeficit > 1000) {
        warning = "Creating a calorie deficit of more than 1000 calories per day is not recommended for most people, as it can lead to serious health risks. You may need to allocate more time.";
    } else if (dailyCalorieDeficit > 500) {
        warning = "A calorie deficit of more than 500 calories per day can help you lose weight faster, but it's important to approach it cautiously. Make sure that you are up for the task.";
    }

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        warning: warning
    };
}

/**
 * Adjusts the diet based on the provided parameters.
 * @param {number} height - The height of the person in centimeters.
 * @param {number} gender - The gender of the person.
 * @param {number} weight - The weight of the person in kilograms.
 * @param {number} age - The age of the person in years.
 * @param {number} targetWeight - The target weight of the person in kilograms.
 * @param {number} targetTime - The target time in weeks for the weight loss.
 * @param {number} weeksIn - The number of weeks the person has been in the target weight.
 * @param {number} weightLoss - The actual weight loss of the person in kilograms.
 * @param {string} activityLevel - Activity level of the person.
 * @returns {Object} - The adjusted diet result.
 */
function adjustDiet(height, gender, weight, age, targetWeight, targetTime, weeksIn, weightLoss, activityLevel) {
    if (height <= 0 || weight <= 0 || age <= 0 || targetWeight <= 0 || targetWeight >= weight || targetTime <= 0 || weeksIn < 0 || weightLoss < 0) {
        throw new Error("Invalid input parameters. Ensure all values are positive and logically consistent.");
    }

    const bmr = calculateBMR(height, gender, weight, age);
    const tdee = calculateTDEE(bmr, activityLevel);
    const totalWeightLossNeeded = weight - targetWeight;
    const expectedWeeklyLoss = totalWeightLossNeeded / targetTime;
    const expectedWeightLoss = expectedWeeklyLoss * weeksIn;
    const weightLossDifference = weightLoss - expectedWeightLoss;

    let adjustedDailyDeficit = (totalWeightLossNeeded * CALORIES_PER_KG) / (targetTime * 7);
    adjustedDailyDeficit += weightLossDifference < 0 ? DEFICIT_ADJUSTMENT : weightLossDifference > 0 ? -DEFICIT_ADJUSTMENT : 0;

    let targetCalories = tdee - adjustedDailyDeficit;
    let warning = "";
    if (adjustedDailyDeficit > 1000) {
        warning = "Creating a calorie deficit of more than 1000 calories per day is not recommended for most people, as it can lead to serious health risks. You may need to allocate more time.";
    } else if (adjustedDailyDeficit > 500) {
        warning = "A calorie deficit of more than 500 calories per day can help you lose weight faster, but it's important to approach it cautiously. Make sure that you are up for the task.";
    }

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        targetCalories: Math.round(targetCalories),
        warning: warning
    };
}

module.exports = {
    calculateDiet,
    adjustDiet
};