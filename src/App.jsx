import React, { useState } from "react"; 
// Importa React y el hook useState desde la librería de React.
// useState permite manejar estado dentro de componentes funcionales.
// Documentación oficial: https://react.dev/reference/react/useState

import "./App.css"; 
// Importa estilos desde un archivo CSS externo.

import logo from "./assets/logotipo.png";
import logoU from "./assets/logo_uni.png";
import hidraulica from "./assets/hidraulica.png";
import target_one from "./assets/taget_one.png";
import target_dos from "./assets/target_dos.png";
import target_tres from "./assets/target_tres.png";
// Importa imágenes desde la carpeta assets para usarlas como recursos visuales.

import FluidSimulation from "./components/FluidSimulation";
import ThermalPhysicalSimulation from "./components/ThermalPhysicalSimulation";
import ViscositySimulation from "./components/ViscositySimulation";
// Importa componentes de simulación definidos en otros archivos para ser usados condicionalmente.

function App() {
  const [showSimulation, setShowSimulation] = useState(false); 
  // Hook useState: se declara una variable de estado llamada showSimulation y su función actualizadora.
  // Inicialmente está en 'false', lo que significa que no se muestra ninguna simulación aún.

  const [simType, setSimType] = useState("fluid"); 
  // Hook useState: se guarda el tipo de simulación seleccionada (fluid, thermal o viscosity).
  // Valor inicial: "fluid".

  return (
    <div className="landing"> 
    {/* Div principal con una clase CSS para aplicar estilos de layout */}

      {showSimulation ? ( 
        // Renderizado condicional usando operador ternario (documentado en React como patrón común).
        // Si showSimulation es true, se muestra la simulación según el tipo seleccionado.
        // Documentación oficial: https://react.dev/learn/conditional-rendering

        simType === "fluid" ? (
          <FluidSimulation onBack={() => setShowSimulation(false)} />
          // Si simType es "fluid", renderiza el componente FluidSimulation.
          // Le pasa una prop llamada onBack que cambia el estado a false (regresar a pantalla principal).

        ) : simType === "thermal" ? (
          <ThermalPhysicalSimulation onBack={() => setShowSimulation(false)} />
          // Si simType es "thermal", renderiza ThermalPhysicalSimulation con la misma lógica.

        ) : (
          <ViscositySimulation onBack={() => setShowSimulation(false)} />
          // Caso por defecto: si no es ninguno de los anteriores, renderiza ViscositySimulation.
        )

      ) : (
        <> 
          {/* Fragmento vacío <> </> para encapsular múltiples elementos sin un div adicional */}
          {/* Documentación oficial: https://react.dev/reference/react/Fragment */}

          <div className="one_view"> 
            {/* Contenedor visual principal */}

            <nav className="navbar"> 
              {/* Barra de navegación superior */}

              <div className="logo"> 
                {/* Contenedor para los logotipos */}
                <img src={logo} alt="Logo" /> 
                {/* Imagen principal del proyecto */}
                <img src={logoU} alt="Logo Universidad" className="logoU" /> 
                {/* Logo de la universidad con una clase CSS personalizada */}
              </div>

              <ul className="nav-links">
                {/* Lista de navegación */}
                
                <li>
                  <a 
                    href="#fluidos" 
                    className="simulation-link"
                    onClick={(e) => {
                      e.preventDefault(); 
                      // Previene el comportamiento por defecto del anchor (navegar).
                      setSimType("fluid"); 
                      // Actualiza el tipo de simulación.
                      setShowSimulation(true); 
                      // Muestra el componente correspondiente.
                    }}
                    // Manejo de eventos en React: https://react.dev/learn/responding-to-events
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
                    // Manejo de eventos en React: https://react.dev/learn/responding-to-events
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
                    // Manejo de eventos en React: https://react.dev/learn/responding-to-events
                  >
                    Simulación Viscosidad
                  </a>
                </li>
              </ul>
            </nav>

            <header className="hero"> {/* Contenedor con clase de nombre hero*/}
              
              <h1> {/* Titulo en tamaño H1 */}
                Explora la Mecánica de Fluidos en 3D: Aprende, Experimenta y
                Simula
              </h1>
            </header>

            <footer className="footer"> {/* Contenedor utilisado para pie de pagina */}
              <p> {/* Etiqueta para poner un parrafo */}
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
              <img src={hidraulica} alt="Sistema Hidráulico" /> {/* Etiqueta que llama imagen que se importo al inicio del codigo */}
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
            Esta simulación muestra cómo se distribuyen gas y líquido en un recipiente cerrado cuando varía su tamaño. El líquido mantiene su volumen constante porque es incompresible, mientras que el gas, siendo compresible, ocupa el espacio restante. No se modifican presión ni temperatura, solo el volumen total.
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
            Simulación 2: Movimiento de partículas con cambios de temperatura y volumen
Se comparan dos recipientes, uno con agua y otro con gas, mostrando cómo se comportan sus partículas. Se pueden ajustar la altura del agua, el volumen del gas y la temperatura, observando las diferencias entre líquido y gas en un espacio cerrado.
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
Se observa cómo la viscosidad del aceite y del agua cambia con la temperatura. Al calentarse, ambos líquidos se vuelven más fluidos; el aceite presenta un cambio más marcado porque es más viscoso a temperatura ambiente. Al enfriarse, la viscosidad aumenta en ambos, pero el aceite sigue siendo más resistente al flujo.
            </p>
          </div>
        
        </div>

        </>
      )}
    </div>
  );
}

export default App;
