import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Logger from "./pages/Logger"
import CategoryPage from "./pages/CategoryPage";
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
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/logger" element={<Logger />}></Route>
          <Route path="/users" element={<Users />}></Route>
          {/* <Route path="/projects" element={<Projects />}></Route> */}
          <Route path="/login" element={<Login />}></Route>
          {/* <Route
            path="/category/:categoryName"
            element={<CategoryPage />}
          ></Route> */}
          <Route path="/create_account" element={<CreateAccount />}></Route>
          <Route path="*" element={<NoPage />}></Route>
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </div>
  );
};

export default App;
