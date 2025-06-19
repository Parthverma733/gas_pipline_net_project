











import React, { useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './Navigation.css';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    gsap.from(".nav-links", {
      x: 100,
      duration: 1.2,
      ease: "power2.out",
      opacity: 0,
      delay: 1.6,
    });

    gsap.from(".navbar", {
      z: -1,
      opacity: 0,
      delay: 1,
      duration: 0.5,
      ease: "power2.in",
    });
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/src/images/logoimages.jpeg" alt="Logo" className="logo-image" />
        <h1 className="logo-text"><span className="bluevoilet">Gas</span> Pipeline Optimizer</h1>
      </div>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="#Home">Home</a></li>
        <li><a href="#grid">Grid</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#FOOTER">Contact</a></li>
        <li><a href="#MAP">Map</a></li>
      </ul>
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>
    </nav>
  );
};

export default Navigation;
