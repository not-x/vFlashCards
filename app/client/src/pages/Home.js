import React from "react";
import { Link, NavLink, useOutlet } from "react-router-dom";

function Navigation() {
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow mb-3">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <h1>vFlashCards</h1>
                        <h6>Flashcards at your finger tip</h6>
                        <h6>Study-aid on the go</h6>
                    </Link>
                    <nav>
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/login">
                                Login
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/signup">
                                Sign up
                            </NavLink>
                        </li>
                    </ul>
                    </nav>
                </div>
            </nav>
        </div>
    );
}
const Home = () => {
    const outlet = useOutlet();
    return (
        <div>
            <Navigation />
            {outlet}
        </div>
    );
}

export default Home;