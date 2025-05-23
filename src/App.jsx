import React from 'react';
import './App.css';
import logo from './assets/logotipo.png'; 
import logoU from './assets/logo_uni.png'; 


function App() {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <img src={logoU} alt="LogoU" className="logoU" />
        </div>
        <ul className="nav-links">
          <li><a href="#">Definición</a></li>
          <li><a href="#">Simulaciones Avanzadas</a></li>
          <li><a href="#">Casos de Estudio</a></li>
        </ul>
      </nav>

      <header className="hero">
        <h1>
          Explora la Mecánica<br />
          de Fluidos en 3D:<br />
          Aprende, Experimenta<br />
          y Simula
        </h1>
      </header>

      <footer className="footer">
        <p>
          *Bienvenido al laboratorio virtual de Mecánica de Fluidos, donde la teoría cobra vida a través de simulaciones 3D interactivas. Explora conceptos clave, experimenta con fluidos en diferentes condiciones y comprende el comportamiento del flujo como nunca antes. Sumérgete en un aprendizaje dinámico y visualiza el poder de los fluidos en movimiento.*
        </p>
      </footer>
    </div>
  );
}

export default App;