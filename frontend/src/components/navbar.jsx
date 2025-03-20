import React from "react";
import "../styles/navbar.css"; // Підключаємо стилі
import { Link, Outlet } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav className="navbar">
                <div className="navbar-logo">
                    {/* <img src="path-to-logo.png" alt="Logo" /> */}
                </div>
                <Link to="/signin">
                    <button className="navbar-button">Sign In</button>
                </Link>
                <Link to="/signup">
                    <button className="navbar-button">Sign Up</button>
                </Link>

            </nav>
            <Outlet></Outlet>
        </>


    );
}

export default Navbar;