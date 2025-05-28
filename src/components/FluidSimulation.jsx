// Importaciones de React para gestión de estado y efectos
import React, { useEffect, useRef, useState } from "react";

// Importaciones específicas de Babylon.js para el core del motor 3D
import {
  Engine, // Motor de renderizado principal
  Scene, // Contenedor de objetos 3D
  MeshBuilder, // Constructor de mallas geométricas
  Vector3, // Clase para manejar coordenadas 3D
  Color3, // Representación de color RGB
  Color4, // Representación de color RGBA
  StandardMaterial, // Material predefinido para objetos
  Texture, // Manejo de texturas de imagen
  GPUParticleSystem, // Sistema de partículas acelerado por GPU
  ArcRotateCamera, // Cámara orbital controlable
  HemisphericLight, // Luz ambiental
  ParticleSystem, // Configuraciones base para sistemas de partículas
} from "@babylonjs/core";

const FluidSimulation = ({ onBack }) => {
  // Referencia al elemento canvas donde se renderizará la escena de Babylon.js
  const canvasRef = useRef(null);

  // Estado para controlar el tamaño del contenedor del fluido
  const [containerSize, setContainerSize] = useState(5);

  // Estado para controlar el paso de la simulación
  const [simulationStep, setSimulationStep] = useState(1);

  // Estado para controlar el nivel de zoom de la cámara
  const [zoomLevel, setZoomLevel] = useState(25);

  // Referencias para almacenar instancias de la escena, cámara y objetos 3D
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const liquidRef = useRef(null);
  const particleSystemRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Verifica que el canvas esté disponible antes de inicializar Babylon.js
    if (!canvasRef.current) return;

    // Crea una instancia del motor de Babylon.js y la escena
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // Establece el color de fondo de la escena a un gris claro
    // Más información: https://doc.babylonjs.com/features/featuresDeepDive/environment/environment_introduction
    scene.clearColor = new Color3(0.95, 0.95, 0.95);
    sceneRef.current = scene;

    // Configura una cámara ArcRotateCamera que orbita alrededor del punto (0,0,0)
    // Más información: https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 3,
      zoomLevel,
      Vector3.Zero(),
      scene
    );
    camera.setPosition(new Vector3(0, 15, zoomLevel)); // Posiciona la cámara en el espacio
    camera.lowerRadiusLimit = 5; // Límite inferior de zoom
    camera.upperRadiusLimit = 100; // Límite superior de zoom
    camera.attachControl(canvasRef.current, false); // Habilita el control de la cámara con el mouse
    cameraRef.current = camera;

    // Añade una luz hemisférica para iluminar la escena de manera uniforme
    // Más información: https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
    new HemisphericLight("light", new Vector3(0, 1, 0), scene).intensity = 0.8;

    // Llama a funciones para crear los elementos 3D: contenedor, líquido y gas
    createContainer(scene);
    createLiquid(scene);
    createGas(scene);

    // Inicia el bucle de renderizado para actualizar y dibujar la escena continuamente
    // Más información: https://doc.babylonjs.com/features/featuresDeepDive/scene/rendering
    engine.runRenderLoop(() => scene.render());

    // Maneja el redimensionamiento de la ventana para ajustar el tamaño del canvas
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    // Limpia los recursos y eventos al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  // Actualizar zoom cuando cambia el slider
  useEffect(() => {
    if (cameraRef.current) {
      // Actualiza el radio de la cámara para reflejar el nuevo nivel de zoom
      // Más información: https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction
      cameraRef.current.radius = zoomLevel;

      // Establece una nueva posición para la cámara basada en el nivel de zoom
      // Nota: setPosition ajusta la posición de la cámara en el espacio 3D
      // Más información: https://forum.babylonjs.com/t/arcrotatecamera-setposition-and-settarget-question/30374
      cameraRef.current.setPosition(new Vector3(0, 15, zoomLevel));
    }
  }, [zoomLevel]);

  useEffect(() => {
    // Llama a la función para actualizar los elementos de la escena cuando cambian el tamaño del contenedor o el paso de simulación
    updateElements();
  }, [containerSize, simulationStep]);

  const createContainer = (scene) => {
    // Crea una caja que representa el contenedor del fluido
    // Más información: https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/box/
    const container = MeshBuilder.CreateBox("container", { size: 5 }, scene);
    containerRef.current = container;

    // Crea un material estándar semi-transparente con modo wireframe para visualizar solo las aristas
    const mat = new StandardMaterial("containerMat", scene);
    mat.alpha = 0.1;
    mat.wireframe = true;
    container.material = mat;
  };

  const createLiquid = (scene) => {
    // Crea una caja que representa el líquido dentro del contenedor
    const liquid = MeshBuilder.CreateBox(
      "liquid",
      {
        width: 4.5,
        height: 4,
        depth: 4.5,
      },
      scene
    );

    // Posiciona el líquido ligeramente por debajo del centro del contenedor
    liquid.position.y = -2.5;

    // Crea un material azul semi-transparente para el líquido
    const mat = new StandardMaterial("liquidMat", scene);
    mat.diffuseColor = new Color3(0.1, 0.3, 0.8);
    mat.alpha = 0.7;
    liquid.material = mat;
    liquidRef.current = liquid;
  };

  const createGas = (scene) => {
    // Crea un sistema de partículas GPU para simular gas
    // Más información: https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/gpu_particles/
    const particleSystem = new GPUParticleSystem(
      "gas",
      { capacity: 2000 },
      scene
    );

    // Asigna una textura de partícula
    particleSystem.particleTexture = new Texture(
      "https://assets.babylonjs.com/textures/flare.png",
      scene
    );

    // Define el volumen de emisión de las partículas
    particleSystem.minEmitBox = new Vector3(-2, -2, -2);
    particleSystem.maxEmitBox = new Vector3(2, 2, 2);

    // Establece los colores de las partículas
    particleSystem.color1 = new Color4(1, 0.3, 0.3, 0.5);
    particleSystem.color2 = new Color4(1, 0.5, 0.5, 0.3);

    // Define el tamaño de las partículas
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;

    // Define la duración de vida de las partículas
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 4;

    // Establece la tasa de emisión de partículas
    particleSystem.emitRate = 500;

    // Establece el modo de mezcla para las partículas
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    // Aplica una gravedad ligera hacia abajo a las partículas
    particleSystem.gravity = new Vector3(0, -0.2, 0);

    // Inicia el sistema de partículas
    particleSystem.start();
    particleSystemRef.current = particleSystem;
  };

  const updateElements = () => {
    // Actualiza la escala del contenedor en los tres ejes (X, Y, Z) proporcionalmente al tamaño definido
    // Más información sobre escalado de mallas: https://doc.babylonjs.com/typedoc/classes/BABYLON.Mesh#scaling
    containerRef.current.scaling = new Vector3(
      containerSize / 5,
      containerSize / 5,
      containerSize / 5
    );

    // Determina la altura del líquido según el paso actual de la simulación
    const liquidHeight = simulationStep === 1 ? 4 : 2;

    // Actualiza la escala en el eje Y del líquido para reflejar la nueva altura
    // Más información sobre Vector3: https://doc.babylonjs.com/typedoc/classes/BABYLON.Vector3
    liquidRef.current.scaling.y = liquidHeight / 4;

    // Ajusta la posición vertical del líquido para que se mantenga en la base del contenedor
    liquidRef.current.position.y = -containerSize / 2 + liquidHeight / 2;

    // Calcula los límites de emisión del gas basados en el tamaño del contenedor
    const gasLimit = containerSize * 0.45;

    // Define la caja mínima desde donde se emitirán las partículas del gas
    // Más información sobre minEmitBox: https://doc.babylonjs.com/typedoc/classes/BABYLON.GPUParticleSystem#minEmitBox
    particleSystemRef.current.minEmitBox = new Vector3(
      -gasLimit,
      -gasLimit,
      -gasLimit
    );

    // Define la caja máxima hasta donde se emitirán las partículas del gas
    // Más información sobre maxEmitBox: https://doc.babylonjs.com/typedoc/classes/BABYLON.GPUParticleSystem#maxEmitBox
    particleSystemRef.current.maxEmitBox = new Vector3(
      gasLimit,
      gasLimit,
      gasLimit
    );
  };

  const nextStep = () => {
    // Avanza al siguiente paso de la simulación si aún no se ha alcanzado el último paso
    if (simulationStep < 3) {
      setSimulationStep((s) => {
        // Si se está en el primer paso, aumenta el tamaño del contenedor
        if (s === 1) setContainerSize(10);
        return s + 1;
      });
    }
  };

  const resetSimulation = () => {
    // Reinicia la simulación al primer paso y restablece el tamaño del contenedor
    setSimulationStep(1);
    setContainerSize(5);
  };

  return (
    <div
      style={{
        position: "fixed", // Fija el contenedor en la pantalla
        top: 0, // Lo coloca al inicio superior
        left: 0, // Lo coloca alineado a la izquierda
        width: "100vw", // Ocupa todo el ancho de la ventana
        height: "100vh", // Ocupa todo el alto de la ventana
        display: "flex", // Usa flexbox
        flexDirection: "column", // Dirección de los elementos en columna
        background: "#ffffff", // Fondo blanco
      }}
    >
      <nav
        style={{
          padding: "1rem", // Espaciado interno
          background: "#0B0723", // Color de fondo oscuro
          display: "flex", // Flexbox
          justifyContent: "space-between", // Espacio entre los elementos
          alignItems: "center", // Centra los elementos verticalmente
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Sombra inferior
        }}
      >
        <button
          onClick={onBack} // Ejecuta la función `onBack` al hacer clic
          style={{
            padding: "8px 16px", // Relleno interno
            background: "#4CAF50", // Color de fondo verde
            border: "none", // Sin borde
            borderRadius: "4px", // Bordes redondeados
            color: "white", // Texto blanco
            cursor: "pointer", // Cambia el cursor al pasar sobre el botón
          }}
        >
          ← Volver {/* Texto del botón */}
        </button>
        <h2 style={{ margin: 0 }}>Simulación Fluidos 3D</h2> {/* Título */}
        <div style={{ width: "100px" }}></div>{" "}
        {/* Espacio vacío para alinear */}
      </nav>

      <div
        style={{
          flex: 1, // Ocupa el espacio restante
          width: "100%", // Ancho completo
          height: "calc(100vh - 60px)", // Resta el alto del nav
          overflow: "hidden", // Oculta el contenido desbordado
        }}
      >
        <canvas
          ref={canvasRef} // Referencia al canvas
          style={{
            width: "100%", // Ancho completo
            height: "100%", // Alto completo
            touchAction: "none", // Desactiva gestos táctiles por defecto
          }}
        />
      </div>

      <div
        style={{
          position: "absolute", // Posición absoluta respecto al contenedor
          bottom: "20px", // Separado del borde inferior
          left: "50%", // Centrado horizontalmente
          transform: "translateX(-50%)", // Ajuste para centrar exactamente
          background: "rgba(255, 255, 255, 0.9)", // Fondo blanco semitransparente
          padding: "1rem", // Espaciado interno
          borderRadius: "8px", // Bordes redondeados
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)", // Sombra alrededor
          textAlign: "center", // Alineación centrada del texto
        }}
      >
        {/* Controles de tamaño y zoom */}
        <div
          style={{
            display: "flex", // Flexbox
            gap: "1rem", // Espacio entre elementos
            justifyContent: "center", // Centrado horizontal
            marginBottom: "1rem", // Margen inferior
          }}
        >
          <label>
            Tamaño: {/* Etiqueta para el control de tamaño */}
            <input
              type="range" // Control tipo rango (slider)
              min="2" // Valor mínimo del slider
              max="20" // Valor máximo del slider
              value={containerSize} // Valor actual vinculado a containerSize
              onChange={(e) => setContainerSize(Number(e.target.value))} // Actualiza el tamaño al cambiar
            />
            <input
              type="number" // Campo para ingresar número manualmente
              min="2" // Mismo rango que el slider
              max="20"
              value={containerSize} // Valor sincronizado
              onChange={(e) => setContainerSize(Number(e.target.value))} // También actualiza el valor
              style={{ width: "60px", marginLeft: "0.5rem" }} // Estilo del campo numérico
            />
          </label>
          <label>
            Zoom: {/* Etiqueta para el control de zoom */}
            <input
              type="range" // Control de tipo rango (slider)
              min="5" // Valor mínimo del zoom
              max="100" // Valor máximo del zoom
              value={zoomLevel} // Valor actual del zoom
              onChange={(e) => setZoomLevel(Number(e.target.value))} // Actualiza el nivel de zoom
            />
            <input
              type="number" // Campo para ingresar el valor de zoom manualmente
              min="5"
              max="100"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              style={{ width: "60px", marginLeft: "0.5rem" }} // Estilo del campo numérico
            />
          </label>
        </div>
        <div
          style={{
            display: "flex", // Usa flexbox
            gap: "1rem", // Espacio entre los botones
            marginBottom: "1rem", // Margen inferior
            justifyContent: "center", // Centra los botones horizontalmente
          }}
        >
          <button
            onClick={nextStep} // Llama a la función para pasar al siguiente paso
            disabled={simulationStep >= 3} // Desactiva el botón si se llega al último paso
            style={{
              padding: "8px 16px", // Espaciado interno
              background: simulationStep >= 3 ? "#cccccc" : "#2196F3", // Cambia de color si está desactivado
              border: "none", // Sin borde
              borderRadius: "4px", // Bordes redondeados
              color: "white", // Texto blanco
              cursor: simulationStep >= 3 ? "not-allowed" : "pointer", // Cursor cambia según el estado
            }}
          >
            {simulationStep === 3 ? "Finalizado" : "Siguiente Paso"}{" "}
            {/* Texto dinámico del botón */}
          </button>
          <button
            onClick={resetSimulation} // Llama a la función para reiniciar la simulación
            style={{
              padding: "8px 16px", // Espaciado interno
              background: "#ff9800", // Color naranja
              border: "none", // Sin borde
              borderRadius: "4px", // Bordes redondeados
              color: "white", // Texto blanco
              cursor: "pointer", // Cursor tipo puntero
            }}
          >
            Reiniciar {/* Texto del botón */}
          </button>
        </div>
        <p style={{ margin: 0, color: "#333" }}>
          {simulationStep === 1 && "Paso 1: Estado inicial - Volumen igual"}{" "}
          {/* Descripción para el paso 1 */}
          {simulationStep === 2 && "Paso 2: Recipiente expandido"}{" "}
          {/* Descripción para el paso 2 */}
          {simulationStep === 3 && "Paso 3: Resultado final"}{" "}
          {/* Descripción para el paso 3 */}
        </p>
      </div>
    </div>
  );
};

export default FluidSimulation; // Exporta el componente para usarlo en otras partes
