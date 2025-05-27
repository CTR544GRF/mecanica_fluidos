import React, { useState } from "react";
import "./App.css";
import logo from "./assets/logotipo.png";
import logoU from "./assets/logo_uni.png";
import hidraulica from "./assets/hidraulica.png";
import target_one from "./assets/taget_one.png";
import target_dos from "./assets/target_dos.png";
import target_tres from "./assets/target_tres.png";

import FluidSimulation from "./components/FluidSimulation";
import ThermalPhysicalSimulation from "./components/ThermalPhysicalSimulation";
import ViscositySimulation from "./components/ViscositySimulation";

function App() {
  const [showSimulation, setShowSimulation] = useState(false);
  const [simType, setSimType] = useState("fluid");

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
              < ul className="nav-links">
                <li>
                  <a 
                    href="#fluidos" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSimType("fluid");
                      setShowSimulation(true);
                    }}
                  >
                    Simulación Fluidos
                  </a>
                </li>

                <li>
                  <a 
                    href="#termicas" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSimType("thermal");
                      setShowSimulation(true);
                    }}
                  >
                    Propiedades Físicas/Térmicas
                  </a>
                </li>

                <li>
                  <a 
                    href="#viscosidad" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSimType("viscosity");
                      setShowSimulation(true);
                    }}
                  >
                    Simulación Viscosidad
                  </a>
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
            <h2>Importancia de la Mecanica de Fluidos en Ingeniería</h2>
            
            <div className="import_text">
              <img src={hidraulica} alt="Sistema Hidráulico" />
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

            <div className="textmake">
              <div className="textbox">
                <h3>🌊 ¿Qué es la Mecánica de Fluidos?</h3>
                <p>
                    La mecánica de fluidos es una rama fundamental de la física que se encarga de estudiar el comportamiento de los fluidos, es decir, de los líquidos y los gases, cuando están en reposo o en movimiento. Esta ciencia busca comprender cómo se desplazan los fluidos, cómo ejercen presión, cómo interactúan con los objetos sólidos que los rodean, y qué leyes rigen su comportamiento ante distintos cambios en el entorno.

                    En la vida diaria, estamos rodeados de ejemplos que involucran fluidos: el agua que sale del grifo, el viento que sopla, la sangre que circula por nuestro cuerpo o el combustible que fluye hacia el motor de un vehículo. Aunque muchas veces no lo notamos, todos estos procesos obedecen principios de la mecánica de fluidos, una ciencia que conecta directamente con nuestra experiencia cotidiana y con el funcionamiento de la tecnología moderna.
                </p>
              </div>
              
              <div className="textbox">
                <h3>📘 Dos ramas principales:</h3>
                <p>
                  Dentro de esta disciplina existen dos áreas fundamentales:

                  Hidrostática: se ocupa del estudio de los fluidos en reposo. Aquí se analizan fenómenos como la presión que ejerce el agua en un estanque, el empuje que permite que un barco flote o la forma en que un líquido se equilibra en recipientes conectados.

                  Hidrodinámica: estudia los fluidos en movimiento. Permite entender cómo fluye el agua por una tubería, cómo se comporta el aire al pasar por las alas de un avión o cómo se genera energía mediante una turbina hidráulica.

                  Ambas ramas trabajan en conjunto para ofrecer una visión completa del comportamiento de los fluidos, tanto en la naturaleza como en sistemas creados por el ser humano.

                </p>
              </div>

              <div className="textbox">
                <h3>⚙️ Aplicaciones prácticas</h3>
                <p>
                La mecánica de fluidos no es solo una teoría abstracta: tiene un enorme valor práctico. Es una herramienta esencial en múltiples campos de la ingeniería y la ciencia, y gracias a ella se pueden diseñar sistemas más seguros, eficientes y sostenibles. Por ejemplo:

                En la ingeniería civil, permite diseñar redes de distribución de agua potable, alcantarillado, canales de riego y sistemas de control de inundaciones.

                En la ingeniería mecánica, se aplica al desarrollo de bombas, motores, sistemas de frenos hidráulicos y climatización.

                En la ingeniería aeroespacial y automotriz, ayuda a mejorar el diseño de vehículos y aeronaves, optimizando su forma para reducir la resistencia del aire.

                En la medicina, permite modelar el flujo sanguíneo y desarrollar dispositivos como válvulas artificiales o máquinas de diálisis.

                En el sector energético, contribuye al diseño de turbinas hidráulicas, centrales térmicas y paneles solares térmicos.

                </p>
              </div>
            </div>
          </div>
          
        <div className="targets_simulation">
          <div className="target">
          <img src={target_one} alt="Logo" />
            <h4>
            <a 
                    href="#fluidos" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSimType("fluid");
                      setShowSimulation(true);
                    }}
                  >
                    Simulación Fluidos
                  </a>
            </h4>
            <p>
            Simulación 1: Volumen de gas y líquido en un recipiente
            En esta simulación se observa cómo se distribuyen el gas y el líquido dentro de un recipiente cerrado a medida que varía su tamaño. A diferencia de otros escenarios, en esta actividad no se modifican variables como la presión o la temperatura; únicamente se altera el volumen total del recipiente. El objetivo es visualizar cómo el líquido, al ser prácticamente incompresible, mantiene su volumen constante, mientras que el gas, al ser compresible, se adapta al espacio restante. Esta simulación permite comprender de manera intuitiva cómo el gas se expande o se comprime según el espacio disponible, mientras que el líquido conserva su forma y volumen independientemente del tamaño del recipiente.
            </p>
          </div>
          
          <div className="target">
          <img src={target_dos} alt="Logo" />
            <h4>
            <a 
                    href="#termicas" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSimType("thermal");
                      setShowSimulation(true);
                    }}
                  >
                    Propiedades Físicas/Térmicas
                  </a>
            </h4>
            <p>
            Simulación 2: Cambios en movimiento de partículas bajo cambios en temperatura y volumen
            La simulación muestra dos recipientes: uno con agua y otro con gas. El agua, de color azul, se mantiene en la parte inferior del recipiente, mientras que el gas, representado por partículas verdes, se dispersa por todo el volumen disponible. A la derecha se encuentran controles para ajustar la altura del agua, el tamaño del gas, la temperatura de ambos y el zoom. La simulación permite comparar cómo se comportan un líquido y un gas en un espacio cerrado.
            </p>
          </div>
          
          <div className="target">
          <img src={target_tres} alt="Logo" />
            <h4>
            <a 
                    href="#viscosidad" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setSimType("viscosity");
                      setShowSimulation(true);
                    }}
                  >
                    Simulación Viscosidad
                  </a>
            </h4>
            <p>
            Simulación 3: Viscosidad bajo cambios de temperatura
            La simulación muestra cómo la viscosidad del aceite y del agua varía con la temperatura. Al aumentar el calor, ambos líquidos se vuelven más fluidos, ya que las partículas se mueven más y hay menos resistencia al flujo. El aceite muestra un cambio más notorio que el agua, porque es más viscoso a temperatura ambiente. Al enfriarse, ambos se espesan, pero el aceite vuelve a resistir más el movimiento que el agua.
            </p>
          </div>
        
        </div>

        </>
      )}
    </div>
  );
}

export default App;
