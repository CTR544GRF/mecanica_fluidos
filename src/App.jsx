import React, { useState } from "react";
import "./App.css";
import logo from "./assets/logotipo.png";
import logoU from "./assets/logo_uni.png";
import hidraulica from "./assets/hidraulica.png";
import FluidSimulation from "./components/FluidSimulation";
import ThermalPhysicalSimulation from "./components/ThermalPhysicalSimulation";
import ViscositySimulation from "./components/ViscositySimulation";

function App() {
  const [showSimulation, setShowSimulation] = useState(false);
  const [simType, setSimType] = useState("fluid");

  const handleSelectChange = (e) => {
    setSimType(e.target.value);
    setShowSimulation(true);
  };

  return (
    <div className="landing">
      {showSimulation ? (
        simType === "fluid" ? (
          <FluidSimulation onBack={() => setShowSimulation(false)} />
        ) : simType === "thermal" ? (
          <ThermalPhysicalSimulation onBack={() => setShowSimulation(false)} />
        ) : (
          <ViscositySimulation onBack={() => setShowSimulation(false)} />
        )
      ) : (
        <>
          <div className="one_view">
            <nav className="navbar">
              <div className="logo">
                <img src={logo} alt="Logo" />
                <img src={logoU} alt="Logo Universidad" className="logoU" />
              </div>
              <ul className="nav-links">
                <li>
                  <a href="#definicion">Definición</a>
                </li>
                <li>
                  <select
                    className="simulation-select"
                    value={simType}
                    onChange={handleSelectChange}
                  >
                    <option value="fluid">Simulación Fluidos</option>
                    <option value="thermal">
                      Propiedades Físicas/Térmicas
                    </option>
                    <option value="viscosity">Simulacion Viscosidad</option>
                  </select>
                </li>
                <li>
                  <a href="#casos">Casos de Estudio</a>
                </li>
              </ul>
            </nav>

            <header className="hero">
              <h1>
                Explora la Mecánica de Fluidos en 3D: Aprende, Experimenta y
                Simula
              </h1>
            </header>

            <footer className="footer">
              <p>
                "Bienvenido al laboratorio virtual de Mecánica de Fluidos, donde
                la teoría cobra vida a través de simulaciones 3D interactivas.
                Explora conceptos clave, experimenta con fluidos en diferentes
                condiciones y comprende el comportamiento del flujo como nunca
                antes. Sumérgete en un aprendizaje dinámico y visualiza el poder
                de los fluidos en movimiento."
              </p>
            </footer>
          </div>

          <div className="second_part">
            <img src={hidraulica} alt="Sistema Hidráulico" />
            <div className="import_text">
              <h2>Importancia en Ingeniería</h2>
              <p>
                La mecánica de fluidos es clave en la ingeniería mecatrónica
                porque permite diseñar y optimizar sistemas que utilizan
                líquidos o gases —desde actuadores hidráulicos y neumáticos
                hasta sistemas de refrigeración y propulsión— con precisión y
                eficiencia. Comprender el comportamiento de los fluidos
                garantiza un control óptimo de fuerzas, pérdidas energéticas y
                respuesta dinámica, traduciéndose en máquinas más seguras,
                fiables y de alto rendimiento. Además, el análisis de flujo y
                presión facilita la prevención de fallos por cavitación o
                sobrepresión, prolongando la vida útil de componentes críticos.
                Su integración con sensores y sistemas de control inteligente
                potencia la automatización, reduciendo consumo energético y
                mejorando la productividad.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
