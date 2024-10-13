import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Users from "./pages/Users";
import Plan from "./pages/Plan";
import Login from "./pages/Login";
import Logger from "./pages/Logger"
import CategoryPage from "./pages/CategoryPage";
import CalorieForm from "./pages/CalorieForm";
import CreateAccount from "./pages/CreateAccount";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/logger" element={<Logger />}></Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/calculator" element={<CalorieForm />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/plan" element={<Plan />}></Route>
          <Route
            path="/category/:categoryName"
            element={<CategoryPage />}
          ></Route>
          <Route path="/create_account" element={<CreateAccount />}></Route>
          <Route path="*" element={<NoPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
