import { NavLink } from "react-router-dom";
import './Header.css';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

function Header() {

    const {user, logout} = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return(
        <header>
            <h1>Moment 3</h1>
            
            <button className="menu-btn">

                <FontAwesomeIcon 
                icon={isOpen ? faXmark: faBars}
                onClick={() => setIsOpen(!isOpen)}
                className="menu-icon"
                />

            </button>

            <nav className={isOpen ? "open": ""}>
                <ul>
                    <li>
                        <NavLink className="nav-link" to={'/'}>
                            Startsida
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className="nav-link" to={'/movies'}>
                            Alla Filmer
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                        className="nav-link"
                        to={'/profile'}>Min sida
                        </NavLink>
                        </li>
                    <li>
                        {
                            !user ? <NavLink className="nav-link" to={'/login'}>Logga in</NavLink> : <button className="logout-btn nav-link" onClick={logout}>Logga ut</button>
                        }
                    </li>
                    {
                        !user && <li><NavLink className="nav-link" to={'/register'}>Skapa konto</NavLink></li>
                    }
                    
                </ul>
            </nav>
        </header>
    )
}

export default Header;