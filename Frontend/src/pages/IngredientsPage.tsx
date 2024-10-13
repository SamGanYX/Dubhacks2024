import { useState } from 'react';
import { useAuth } from '../AuthContext'; // Assuming you have this context for authentication
import { useNavigate } from 'react-router-dom';
import "./IngredientsPage.css";
interface Recipe {
    recipeID: number;
    userID: number;
    calories: number;
    recipeName: string;
    ingredients: string;
    instructions: string;
    dateGenerated: string;
}

const IngredientsPage = () => {
    const [ingredients, setIngredients] = useState('');
    const userID = localStorage.getItem("userID");
    const navigate = useNavigate();

    // Function to fetch recipes based on ingredients
    const getRecipes = async () => {
        const formattedString = `UserID: ${userID}, Ingredients: ${ingredients}`;
        console.log(formattedString);
        try {
            const response = await fetch(`http://localhost:8081/api/getRecipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: formattedString }),
            });
            
            const data = await response.json();
            
            // Assuming the response contains a list of recipes
            console.log(data);
            if (data.message === 'Recipe inserted successfully.') {
                console.log(data);
                navigate('/recipes');
            } else {
                console.error('Mission failed, did not add to database');
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        getRecipes(); // Call the getRecipes function
    };

    return (
        <div className="ingredients-page">
            <h1>Find Recipes by Ingredients</h1>
            <form onSubmit={handleSubmit}>
                <textarea 
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Enter ingredients separated by commas"
                    rows={4}
                    cols={50}
                    required
                />
                <br />
                <button type="submit" className="ingredientbutton">Get Recipes</button>
            </form>
        </div>
    );
};

export default IngredientsPage;
