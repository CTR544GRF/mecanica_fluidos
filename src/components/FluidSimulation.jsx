import React, { useEffect, useRef, useState } from 'react';
import { 
  Engine, 
  Scene, 
  MeshBuilder, 
  Vector3, 
  Color3, 
  Color4,
  StandardMaterial, 
  Texture, 
  GPUParticleSystem, 
  ArcRotateCamera, 
  HemisphericLight,
  ParticleSystem
} from "@babylonjs/core";

const FluidSimulation = ({ onBack }) => {
  const canvasRef = useRef(null);
  const [containerSize, setContainerSize] = useState(5);
  const [simulationStep, setSimulationStep] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(25);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const liquidRef = useRef(null);
  const particleSystemRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.95, 0.95, 0.95);
    sceneRef.current = scene;

    // Cámara interactiva con zoom controlado
    const camera = new ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, zoomLevel, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(0, 15, zoomLevel));
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 100;
    camera.attachControl(canvasRef.current, false);
    cameraRef.current = camera;

    // Iluminación
    new HemisphericLight("light", new Vector3(0, 1, 0), scene).intensity = 0.8;

    // Crear elementos 3D
    createContainer(scene);
    createLiquid(scene);
    createGas(scene);

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  // Actualizar zoom cuando cambia el slider
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.radius = zoomLevel;
      cameraRef.current.setPosition(new Vector3(0, 15, zoomLevel));
    }
  }, [zoomLevel]);

  useEffect(() => {
    updateElements();
  }, [containerSize, simulationStep]);

  const createContainer = (scene) => {
    const container = MeshBuilder.CreateBox("container", { size: 5 }, scene);
    containerRef.current = container;
    const mat = new StandardMaterial("containerMat", scene);
    mat.alpha = 0.1;
    mat.wireframe = true;
    container.material = mat;
  };

  const createLiquid = (scene) => {
    const liquid = MeshBuilder.CreateBox("liquid", { 
      width: 4.5, 
      height: 4, 
      depth: 4.5 
    }, scene);
    liquid.position.y = -2.5;
    
    const mat = new StandardMaterial("liquidMat", scene);
    mat.diffuseColor = new Color3(0.1, 0.3, 0.8);
    mat.alpha = 0.7;
    liquid.material = mat;
    liquidRef.current = liquid;
  };

  const createGas = (scene) => {
    const particleSystem = new GPUParticleSystem("gas", { capacity: 2000 }, scene);
    particleSystem.particleTexture = new Texture("https://assets.babylonjs.com/textures/flare.png", scene);
    
    particleSystem.minEmitBox = new Vector3(-2, -2, -2);
    particleSystem.maxEmitBox = new Vector3(2, 2, 2);
    particleSystem.color1 = new Color4(1, 0.3, 0.3, 0.5);
    particleSystem.color2 = new Color4(1, 0.5, 0.5, 0.3);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 4;
    particleSystem.emitRate = 500;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new Vector3(0, -0.2, 0);
    
    particleSystem.start();
    particleSystemRef.current = particleSystem;
  };

  const updateElements = () => {
    // Actualizar contenedor
    containerRef.current.scaling = new Vector3(containerSize/5, containerSize/5, containerSize/5);
    
    // Actualizar líquido
    const liquidHeight = simulationStep === 1 ? 4 : 2;
    liquidRef.current.scaling.y = liquidHeight/4;
    liquidRef.current.position.y = -containerSize/2 + liquidHeight/2;
    
    // Actualizar gas
    const gasLimit = containerSize * 0.45;
    particleSystemRef.current.minEmitBox = new Vector3(-gasLimit, -gasLimit, -gasLimit);
    particleSystemRef.current.maxEmitBox = new Vector3(gasLimit, gasLimit, gasLimit);
  };

  const nextStep = () => {
    if (simulationStep < 3) {
      setSimulationStep(s => {
        if (s === 1) setContainerSize(10);
        return s + 1;
      });
    }
  };

  const resetSimulation = () => {
    setSimulationStep(1);
    setContainerSize(5);
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff'
    }}>
      <nav style={{ 
        padding: '1rem',
        background: '#0B0723',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={onBack}
          style={{
            padding: '8px 16px',
            background: '#4CAF50',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ← Volver
        </button>
        <h2 style={{ margin: 0 }}>Simulación Fluidos 3D</h2>
        <div style={{ width: '100px' }}></div>
      </nav>
      
      <div style={{ 
        flex: 1,
        width: '100%',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden'
      }}>
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: '100%',
            height: '100%',
            touchAction: 'none'
          }}
        />
      </div>
      
      <div style={{ 
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        {/* Controles de tamaño y zoom */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <label>
            Tamaño: 
            <input
              type="range"
              min="2"
              max="20"
              value={containerSize}
              onChange={e => setContainerSize(Number(e.target.value))}
            />
            <input
              type="number"
              min="2"
              max="20"
              value={containerSize}
              onChange={e => setContainerSize(Number(e.target.value))}
              style={{ width: '60px', marginLeft: '0.5rem' }}
            />
          </label>
          <label>
            Zoom: 
            <input
              type="range"
              min="5"
              max="100"
              value={zoomLevel}
              onChange={e => setZoomLevel(Number(e.target.value))}
            />
            <input
              type="number"
              min="5"
              max="100"
              value={zoomLevel}
              onChange={e => setZoomLevel(Number(e.target.value))}
              style={{ width: '60px', marginLeft: '0.5rem' }}
            />
          </label>
        </div>
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          justifyContent: 'center'
        }}>
          <button 
            onClick={nextStep}
            disabled={simulationStep >= 3}
            style={{
              padding: '8px 16px',
              background: simulationStep >= 3 ? '#cccccc' : '#2196F3',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: simulationStep >= 3 ? 'not-allowed' : 'pointer'
            }}
          >
            {simulationStep === 3 ? 'Finalizado' : 'Siguiente Paso'}
          </button>
          <button 
            onClick={resetSimulation}
            style={{
              padding: '8px 16px',
              background: '#ff9800',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Reiniciar
          </button>
        </div>
        <p style={{ margin: 0, color: '#333' }}>
          {simulationStep === 1 && 'Paso 1: Estado inicial - Volumen igual'}
          {simulationStep === 2 && 'Paso 2: Recipiente expandido'}
          {simulationStep === 3 && 'Paso 3: Resultado final'}
        </p>
      </div>
    </div>
  );
};

export default FluidSimulation;