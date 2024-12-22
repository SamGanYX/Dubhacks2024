import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext'; // Assuming you have this context for authentication
import { useNavigate } from 'react-router-dom';
import "./CuisinesPage.css"; // Create a new CSS file for styling

interface Ingredient {
    ID: number,
    IngredientName: string
}
const CuisinesPage = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [cuisine, setCuisine] = useState<string>('');
    const userID = localStorage.getItem("userID");
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate, loading]);

    // Fetch ingredients from the backend
    const fetchIngredients = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/ingredients/${userID}`);
            const data = await response.json();
            setIngredients(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    // Function to fetch recipes based on cuisine and ingredients
    const getRecipesByCuisine = async () => {
        const formattedString = `UserID: ${userID}, Cuisine: ${cuisine}, Ingredients: ${ingredients.map(ingredient => ingredient.IngredientName).join(',')}`;
        console.log(formattedString);
        try {
            const response = await fetch(`http://localhost:8081/api/getRecipesByCuisine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: formattedString }),
            });
            
            const data = await response.json();
            console.log(data);
            if (data.message === 'Recipe inserted successfully.') {
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
        getRecipesByCuisine(); // Call the getRecipesByCuisine function
    };

    useEffect(() => {
        fetchIngredients(); // Fetch ingredients on component mount
    }, []);

    return (
        <div className="cuisines-page">
            <h1>Find Recipes by Cuisine</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    placeholder="Enter cuisine"
                    required
                />
                <br />
                <button type="submit" className="cuisinebutton">Get Recipes</button>
            </form>
        </div>
    );
};

export default CuisinesPage; 