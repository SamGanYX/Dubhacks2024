import React, { useEffect, useState } from 'react';

interface Ingredient {
    ID: number,
    IngredientName: string
}

const IngredientsList: React.FC = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientName, setIngredientName] = useState<string>('');
    const userID = 1; // Replace with actual user ID from context or props

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

    // Add a new ingredient
    const addIngredient = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!ingredientName) return;

        try {
            const response = await fetch('http://localhost:8081/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, ingredientName }),
            });

            if (response.ok) {
                setIngredientName(''); // Clear input
                fetchIngredients(); // Refresh the ingredient list
            } else {
                const errorData = await response.json();
                console.error('Error adding ingredient:', errorData);
            }
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    // Delete an ingredient
    const deleteIngredient = async (ingredientID: number) => {
        try {
            const response = await fetch(`http://localhost:8081/api/ingredients/${ingredientID}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchIngredients(); // Refresh the ingredient list
            } else {
                const errorData = await response.json();
                console.error('Error deleting ingredient:', errorData);
            }
        } catch (error) {
            console.error('Error deleting ingredient:', error);
        }
    };

    useEffect(() => {
        fetchIngredients(); // Fetch ingredients on component mount
    }, []);

    return (
        <div>
            <h1>Your Ingredients</h1>
            <form onSubmit={addIngredient}>
                <input
                    type="text"
                    value={ingredientName}
                    onChange={(e) => setIngredientName(e.target.value)}
                    placeholder="Enter ingredient name"
                    required
                />
                <button type="submit">Add Ingredient</button>
            </form>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient.ID}>
                        {ingredient.IngredientName}
                        <button onClick={() => deleteIngredient(ingredient.ID)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientsList;