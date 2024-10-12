import React, { useState } from "react";
import { Link, BrowserRouter, NavLink, Router, Route } from "react-router-dom";
import "./Footer.css";
function Footer() {
  return (
    <div className="footer">
      <ul>
        <li>
          <NavLink to="/about">About</NavLink>
        </li>
        <li>
          <NavLink to="/contact">Contact</NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Footer;
