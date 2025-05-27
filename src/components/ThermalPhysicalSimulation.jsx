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
  ParticleSystem,
  ArcRotateCamera,
  HemisphericLight
} from '@babylonjs/core';

const ThermalPhysicalSimulation = ({ onBack }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const liquidBoxRef = useRef(null);
  const gasBoxRef = useRef(null);
  const liquidPSRef = useRef(null);
  const gasPSRef = useRef(null);
  const cameraRef = useRef(null);
  const waterMeshRef = useRef(null);

  // State for independent controls
  const [liquidSize, setLiquidSize] = useState(1);
  const [gasSize, setGasSize] = useState(1);
  const [tempLiquid, setTempLiquid] = useState(0);
  const [tempGas, setTempGas] = useState(0);
  const [zoom, setZoom] = useState(60);

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.1, 0.1, 0.2);
    sceneRef.current = scene;

    // Camera setup
    const camera = new ArcRotateCamera('cam', -Math.PI / 2, Math.PI / 3, zoom, Vector3.Zero(), scene);
    camera.upperRadiusLimit = 100;
    camera.lowerRadiusLimit = 10;
    camera.attachControl(canvasRef.current, true);
    cameraRef.current = camera;

    // Light
    new HemisphericLight('light', new Vector3(0,1,0), scene).intensity = 0.8;

    // Create containers
    const createContainer = (name, posX) => {
      const box = MeshBuilder.CreateBox(name, { size: 10 }, scene);
      box.position.x = posX;
      const mat = new StandardMaterial(name + 'Mat', scene);
      mat.alpha = 0.2;
      mat.wireframe = true;
      mat.diffuseColor = new Color3(1, 1, 1);
      box.material = mat;
      return box;
    };
    
    liquidBoxRef.current = createContainer('liquidBox', -12);
    gasBoxRef.current = createContainer('gasBox', 12);

    // Create water mesh - ahora siempre del tamaño del contenedor
    const createWaterMesh = () => {
      const water = MeshBuilder.CreateBox('water', { 
        width: 10, 
        height: 10, 
        depth: 10 
      }, scene);
      water.position = new Vector3(-12, 0, 0);
      
      const waterMat = new StandardMaterial('waterMat', scene);
      waterMat.diffuseColor = new Color3(0.2, 0.5, 1);
      waterMat.alpha = 0.7;
      waterMat.specularColor = new Color3(0.5, 0.6, 0.7);
      water.material = waterMat;
      
      return water;
    };
    
    waterMeshRef.current = createWaterMesh();

    // Create particles
    const createParticles = (name, capacity, color, containerMesh, ref, isLiquid = false) => {
      const ps = new GPUParticleSystem(name, { capacity }, scene);
      ps.particleTexture = new Texture('https://assets.babylonjs.com/textures/flare.png', scene);
      ps.emitter = containerMesh;
      ps.minEmitBox = new Vector3(-4.9, -4.9, -4.9);
      ps.maxEmitBox = new Vector3(4.9, 4.9, 4.9);
      ps.color1 = new Color4(color.r, color.g, color.b, 1);
      ps.color2 = new Color4(color.r, color.g, color.b, 1);
      ps.minSize = isLiquid ? 0.2 : 0.1; // Partículas de líquido más grandes
      ps.maxSize = isLiquid ? 0.3 : 0.2;
      ps.emitRate = capacity;
      ps.minEmitPower = 0;
      ps.maxEmitPower = 0;
      ps.blendMode = ParticleSystem.BLENDMODE_ONEONE;
      ps.start();
      ref.current = ps;
    };
    
    // Azul para líquido (partículas más grandes), verde neón para gas
    createParticles('liquidPS', 800, new Color3(0.2, 0.5, 1), liquidBoxRef.current, liquidPSRef, true);
    createParticles('gasPS', 800, new Color3(0.2, 1, 0.2), gasBoxRef.current, gasPSRef);

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());
    return () => engine.dispose();
  }, []);

  // Update boxes and particles on control change
  useEffect(() => {
    const liquidBox = liquidBoxRef.current;
    const gasBox = gasBoxRef.current;
    const liquidPS = liquidPSRef.current;
    const gasPS = gasPSRef.current;
    const waterMesh = waterMeshRef.current;
    const camera = cameraRef.current;
    
    if (!liquidBox || !gasBox || !waterMesh || !camera) return;

    // Adjust sizes
    liquidBox.scaling.set(1, liquidSize, 1);
    gasBox.scaling.set(gasSize, gasSize, gasSize);
    
    // Update water mesh - ahora escala solo en Y para mantener la altura del contenedor
    waterMesh.scaling = new Vector3(1, liquidSize, 1);
    waterMesh.position.y = 0; // Centrado verticalmente

    // Update camera zoom
    camera.radius = zoom;

    // Reset velocities
    liquidPS.minEmitPower = 0;
    liquidPS.maxEmitPower = 0;
    gasPS.minEmitPower = 0;
    gasPS.maxEmitPower = 0;

    // Medium speed base
    liquidPS.minEmitPower = 0.05 + tempLiquid * 0.05;
    liquidPS.maxEmitPower = 0.1 + tempLiquid * 0.1;
    gasPS.minEmitPower = 0.3 + tempGas * 0.5;
    gasPS.maxEmitPower = 0.7 + tempGas * 1.0;

    // Directions random
    liquidPS.direction1.set(-0.5, -0.5, -0.5);
    liquidPS.direction2.set(0.5, 0.5, 0.5);
    gasPS.direction1.set(-1, -1, -1);
    gasPS.direction2.set(1, 1, 1);

    // Ajuste de partículas de gas según tamaño del contenedor
    if (gasPS) {
      // Cuando el contenedor es más grande, partículas más pequeñas y separadas
      // Cuando es más pequeño, partículas más grandes y juntas
      const sizeFactor = 1 / gasSize;
      gasPS.minSize = 0.1 * sizeFactor;
      gasPS.maxSize = 0.2 * sizeFactor;
      gasPS.updateParticle = (particle) => {
        // Ajustar la posición para mantener la densidad
        particle.position.x *= gasSize;
        particle.position.y *= gasSize;
        particle.position.z *= gasSize;
      };
    }
  }, [liquidSize, gasSize, tempLiquid, tempGas, zoom]);

  return (
    <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh' }}>
      <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block' }} />
      <div style={{ position:'absolute', top:'10px', left:'10px' }}>
        <button onClick={onBack} style={{
          background: '#333',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>← Volver</button>
      </div>
      <div style={{ 
        position:'absolute', 
        top:'10%', 
        right:'20px', 
        background:'rgba(0,0,0,0.7)', 
        padding:'1rem', 
        borderRadius:'8px', 
        boxShadow:'0 2px 8px rgba(0,0,0,0.5)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '8px' }}>Controles</h3>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Altura Agua: {liquidSize.toFixed(2)}</label>
          <input 
            type='range' 
            min='0.2' 
            max='1.5' 
            step='0.01' 
            value={liquidSize} 
            onChange={e=>setLiquidSize(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Tamaño Gas: {gasSize.toFixed(2)}</label>
          <input 
            type='range' 
            min='0.2' 
            max='2' 
            step='0.01' 
            value={gasSize} 
            onChange={e=>setGasSize(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Temperatura Agua: {tempLiquid}</label>
          <input 
            type='range' 
            min='0' 
            max='5' 
            step='1' 
            value={tempLiquid} 
            onChange={e=>setTempLiquid(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Temperatura Gas: {tempGas}</label>
          <input 
            type='range' 
            min='0' 
            max='5' 
            step='1' 
            value={tempGas} 
            onChange={e=>setTempGas(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Zoom: {zoom.toFixed(0)}</label>
          <input 
            type='range' 
            min='20' 
            max='100' 
            step='1' 
            value={zoom} 
            onChange={e=>setZoom(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThermalPhysicalSimulation;