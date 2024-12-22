import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import NoPage from "./pages/NoPage";
import Users from "./pages/Users";
import Plan from "./pages/Plan";
import Login from "./pages/Login";
import Logger from "./pages/Logger"
import CalorieForm from "./pages/CalorieForm";
import CuisinesPage from "./pages/CuisinesPage";
import CreateAccount from "./pages/CreateAccount";
import Navbar from "./components/NavBar/Navbar";
import ChatBot from "./pages/ChatBot";
import Recipes from "./pages/Recipes";
import IngredientsPage from "./pages/IngredientsPage";
import Workouts from "./pages/Workout";
import GenerateWorkout from "./pages/GenerateWorkout";
import IngredientsList from "./pages/IngredientsList";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar></Navbar>
        <div className="padded-div">
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/logger" element={<Logger />}></Route>
            <Route path="/users" element={<Users />}></Route>
            <Route path="/calculator" element={<CalorieForm />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/plan" element={<Plan />}></Route>
            <Route path="/recipes" element={<Recipes />}></Route>
            <Route path="/ingredients" element={<IngredientsPage />}></Route>
            <Route path="/cuisines" element={<CuisinesPage />}></Route>
            <Route path="/ingredientsList" element={<IngredientsList />}></Route>
            <Route path="/workout" element={<Workouts />}></Route>
            <Route path="/generateWorkout" element={<GenerateWorkout />}></Route>
            <Route path="/create_account" element={<CreateAccount />}></Route>
            <Route path="*" element={<NoPage />}></Route>
            <Route path="/chat" element={<ChatBot />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
