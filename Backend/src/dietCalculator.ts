enum Gender {
    Male,
    Female
}

interface DietResult {
    bmr: number;
    tdee: number; // Added TDEE to the result for better context
    targetCalories: number;
    warning: string;
}

// Constants for calculations
const CALORIES_PER_KG: number = 7700; // Calories needed to lose 1 kg of fat
const MIN_SAFE_CALORIES: number = 1200; // Minimum safe calorie intake
const DEFICIT_ADJUSTMENT: number = 100; // Adjustment for daily calorie deficit

// Activity level multipliers
const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2, // Little or no exercise
    lightlyActive: 1.375, // Light exercise/sports 1-3 days/week
    moderatelyActive: 1.55, // Moderate exercise/sports 3-5 days/week
    veryActive: 1.725, // Hard exercise/sports 6-7 days a week
    extraActive: 1.9 // Very hard exercise/sports & a physical job
};

/**
 * Calculates the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 * @param {number} height - Height in centimeters.
 * @param {Gender} gender - Gender of the person.
 * @param {number} weight - Weight in kilograms.
 * @param {number} age - Age in years.
 * @returns {number} - The calculated BMR.
 */
function calculateBMR(height: number, gender: Gender, weight: number, age: number): number {
    return gender === Gender.Male
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * Calculates the Total Daily Energy Expenditure (TDEE).
 * @param {number} bmr - Basal Metabolic Rate.
 * @param {string} activityLevel - Activity level of the person.
 * @returns {number} - The calculated TDEE.
 */
function calculateTDEE(bmr: number, activityLevel: string): number {
    const multiplier = activityMultipliers[activityLevel];
    if (!multiplier) {
        throw new Error("Invalid activity level. Valid options are: sedentary, lightlyActive, moderatelyActive, veryActive, extraActive.");
    }
    return bmr * multiplier;
}

/**
 * Calculates the diet based on the provided parameters.
 * @constructor
 * @param {number} height - The height of the person in centimeters.
 * @param {Gender} gender - The gender of the person.
 * @param {number} weight - The weight of the person in kilograms.
 * @param {number} age - The age of the person in years.
 * @param {number} targetWeight - The target weight of the person in kilograms.
 * @param {number} targetTime - The target time in weeks for the weight loss.
 * @param {string} activityLevel - Activity level of the person.
 * @returns {DietResult} - The calculated diet result.
 * @example
 * const result = calculateDiet(180, Gender.Male, 80, 25, 70, 6, 'moderatelyActive');
 */
function calculateDiet(height: number, gender: Gender, weight: number, age: number, targetWeight: number, targetTime: number, activityLevel: string): DietResult {
    // Validate input parameters
    if (height <= 0 || weight <= 0 || age <= 0 || targetWeight <= 0 || targetWeight >= weight || targetTime <= 0) {
        throw new Error("Invalid input parameters. Ensure all values are positive and logically consistent.");
    }

    // Calculate BMR
    const bmr: number = calculateBMR(height, gender, weight, age);

    // Calculate TDEE
    const tdee: number = calculateTDEE(bmr, activityLevel);

    // Calculate the total calorie deficit needed to reach the target weight
    const weightDifference: number = weight - targetWeight;
    const calorieDeficitNeeded: number = weightDifference * CALORIES_PER_KG; // Total calories to lose the target weight

    // Calculate daily calorie deficit
    const dailyCalorieDeficit: number = calorieDeficitNeeded / (targetTime * 7); // targetTime in weeks

    // Calculate target calories
    const targetCalories: number = tdee - dailyCalorieDeficit;

    let warning: string = "";
    if (dailyCalorieDeficit > 1000) {
        warning = "Creating a calorie deficit of more than 1000 calories per day is not recommended for most people, as it can lead to serious health risks. You may need to allocate more time.";
    } else if (dailyCalorieDeficit > 500) {
        warning = "A calorie deficit of more than 500 calories per day can help you lose weight faster, but it's important to approach it cautiously. Make sure that you are up for the task.";
    }

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee), // Include TDEE in the result
        targetCalories: Math.round(targetCalories),
        warning: warning
    };
}

/**
 * Adjusts the diet based on the provided parameters.
 * @constructor
 * @param {number} height - The height of the person in centimeters.
 * @param {Gender} gender - The gender of the person.
 * @param {number} weight - The weight of the person in kilograms.
 * @param {number} age - The age of the person in years.
 * @param {number} targetWeight - The target weight of the person in kilograms.
 * @param {number} targetTime - The target time in weeks for the weight loss.
 * @param {number} weeksIn - The number of weeks the person has been in the target weight.
 * @param {number} weightLoss - The actual weight loss of the person in kilograms.
 * @param {string} activityLevel - Activity level of the person.
 * @returns {DietResult} - The adjusted diet result.
 * @example
 * const result = adjustDiet(180, Gender.Male, 80, 25, 70, 6, 3, 2, 'moderatelyActive');
 */
function adjustDiet(height: number, gender: Gender, weight: number, age: number, targetWeight: number, targetTime: number, weeksIn: number, weightLoss: number, activityLevel: string): DietResult {
    // Validate input parameters
    if (height <= 0 || weight <= 0 || age <= 0 || targetWeight <= 0 || targetWeight >= weight || targetTime <= 0 || weeksIn < 0 || weightLoss < 0) {
        throw new Error("Invalid input parameters. Ensure all values are positive and logically consistent.");
    }

    // Calculate initial BMR
    const bmr: number = calculateBMR(height, gender, weight, age);
    const tdee: number = calculateTDEE(bmr, activityLevel);

    // Calculate the total weight loss needed
    const totalWeightLossNeeded: number = weight - targetWeight;

    // Calculate expected weight loss per week
    const expectedWeeklyLoss: number = totalWeightLossNeeded / targetTime;

    // Calculate expected weight loss so far
    const expectedWeightLoss: number = expectedWeeklyLoss * weeksIn;

    // Calculate the difference between actual and expected weight loss
    const weightLossDifference: number = weightLoss - expectedWeightLoss;

    // Adjust daily calorie deficit based on the difference
    let adjustedDailyDeficit: number = (totalWeightLossNeeded * CALORIES_PER_KG) / (targetTime * 7);
    adjustedDailyDeficit += weightLossDifference < 0 ? DEFICIT_ADJUSTMENT : weightLossDifference > 0 ? -DEFICIT_ADJUSTMENT : 0;

    // Calculate adjusted target calories
    let targetCalories: number = tdee - adjustedDailyDeficit;

    // Ensure the calorie deficit isn't too extreme
    let warning: string = "";
    if (adjustedDailyDeficit > 1000) {
        warning = "Creating a calorie deficit of more than 1000 calories per day is not recommended for most people, as it can lead to serious health risks. You may need to allocate more time.";
    } else if (adjustedDailyDeficit > 500) {
        warning = "A calorie deficit of more than 500 calories per day can help you lose weight faster, but it's important to approach it cautiously. Make sure that you are up for the task.";
    }

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee), // Include TDEE in the result
        targetCalories: Math.round(targetCalories),
        warning: warning
    };
}