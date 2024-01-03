import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import "./nav.css";
const Navbar=()=> {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="styling">
   <div>

  <h3>LANGUAGE TRANSLATION TOOL </h3>
   </div>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
          <ul className={menuOpen ? "open" : ""}>
          <li>
              <NavLink to="/">TranslationApp</NavLink>
            </li>
          <li>
              <NavLink to="/SpeechTranslation">SpeechTranslation</NavLink>
            </li>
            <li>
              <NavLink to="/DocumentTranslation">DocumentTranslation</NavLink>
            </li>
            <li>
              <NavLink to="/ImagetoTextTranslation">ImageToTextTranslation</NavLink>
            </li>
          </ul>
        </nav>

  )
}

export default Navbar