import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./recipes.css";

interface Recipe {
    recipeID: number;
    userID: number;
    calories: number;
    recipeName: string;
    ingredients: string;
    instructions: string;
    dateGenerated: string;
}

const Recipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // State to track total pages
    const userID = localStorage.getItem("userID");
    const navigate = useNavigate(); // Initialize useNavigate
    const { isAuthenticated, token } = useAuth();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setLoading(false);
      if (!loading && !isAuthenticated) {
        navigate("/login");
      }
    }, [isAuthenticated, navigate, loading]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/recipes/${userID}?page=${currentPage}`);
                const data = await response.json();

                // Ensure data.recipes is an array and handle total pages
                if (Array.isArray(data.recipes)) {
                    setRecipes(data.recipes);
                    setTotalPages(data.totalPages); // Set total pages from the response
                } else {
                    console.error('Fetched data is not an array:', data.recipes);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, [currentPage, userID]);

    return (
        <div className="recipes-container">
            <h1>Your Recipes</h1>
            {recipes.length > 0 ? (
                <ul className="recipes_ul">
                    {recipes.map((recipe) => (
                        <li key={recipe.recipeID}>
                            <h2>{recipe.recipeName}</h2>
                            <p>Ingredients: {recipe.ingredients}</p>
                            <p>Instructions: {recipe.instructions}</p>
                            <p>Calories: {recipe.calories}</p>
                            <p>Date Generated: {new Date(recipe.dateGenerated).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recipes found.</p>
            )}
            {/* Navigation Buttons */}
            <div className="navigation">
                {currentPage > 1 && (
                    <button onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                )}
                {currentPage < totalPages && (
                    <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                )}
            </div>
            {/* Button to navigate to Ingredients Page */}
            <button onClick={() => navigate('/ingredients/')} className="navigationbutton">
                Go to Ingredients
            </button>
        </div>
    );
};

export default Recipes;
