import React, { useState, useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
  ParticleSystem,
} from "@babylonjs/core";

const ViscositySimulation = ({ onBack }) => {
  const reactCanvas = useRef(null);
  const [oilTemperature, setOilTemperature] = useState(20);
  const [waterTemperature, setWaterTemperature] = useState(20);
  const [selectedTube, setSelectedTube] = useState("oil");

  useEffect(() => {
    if (!reactCanvas.current) return;

    const canvas = reactCanvas.current;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Configuración de cámara y luz
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 3,
      10,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Crear tubos
    const oilTube = createTube(scene, "oilTube", new Color3(0.8, 0.8, 0.1), -2);
    const waterTube = createTube(
      scene,
      "waterTube",
      new Color3(0.1, 0.3, 0.8),
      2
    );

    // Crear gotas
    const oilDrop = createDrop(scene, "oilDrop", new Color3(0.9, 0.9, 0.2), -2);
    const waterDrop = createDrop(
      scene,
      "waterDrop",
      new Color3(0.2, 0.4, 0.9),
      2
    );

    // Sistemas de partículas
    const oilParticles = createFluidParticles(
      scene,
      oilTube,
      new Color3(0.9, 0.9, 0.2),
      -2
    );
    const waterParticles = createFluidParticles(
      scene,
      waterTube,
      new Color3(0.2, 0.4, 0.9),
      2
    );

    // Animación
    let dropPosition = { oil: 4, water: 4 };
    
    scene.registerBeforeRender(() => {
      const deltaTime = engine.getDeltaTime() / 1000;
      const oilViscosity = calculateViscosity("oil", oilTemperature);
      const waterViscosity = calculateViscosity("water", waterTemperature);

      // Movimiento de gotas
      dropPosition.oil = updateDropPosition(dropPosition.oil, deltaTime, oilViscosity, oilDrop);
      dropPosition.water = updateDropPosition(dropPosition.water, deltaTime, waterViscosity, waterDrop);

      updateParticles(oilParticles, oilViscosity);
      updateParticles(waterParticles, waterViscosity);
    });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
    
    return () => {
      window.removeEventListener("resize", () => engine.resize());
      engine.dispose();
    };
  }, [oilTemperature, waterTemperature]);

  const updateDropPosition = (position, deltaTime, viscosity, drop) => {
    if (position > -4) {
      const newPosition = position - deltaTime * (1 / viscosity);
      drop.position.y = newPosition;
      return newPosition;
    }
    drop.position.y = 4;
    return 4;
  };

  const createTube = (scene, name, color, xPos) => {
    const tube = MeshBuilder.CreateCylinder(
      name,
      { height: 8, diameter: 2 },
      scene
    );
    tube.position.x = xPos;
    const mat = new StandardMaterial(`${name}Mat`, scene);
    mat.diffuseColor = color;
    mat.alpha = 0.3;
    tube.material = mat;
    return tube;
  };

  const createDrop = (scene, name, color, xPos) => {
    const drop = MeshBuilder.CreateSphere(
      name,
      { diameter: 0.8, segments: 32 },
      scene
    );
    drop.position = new Vector3(xPos, 4, 0);
    const mat = new StandardMaterial(`${name}Mat`, scene);
    mat.diffuseColor = color;
    mat.specularColor = new Color3(0.5, 0.5, 0.5);
    mat.emissiveColor = color.scale(0.2);
    mat.alpha = 0.9;
    drop.material = mat;
    return drop;
  };

  const createFluidParticles = (scene, emitter, color, xPos) => {
    const particleSystem = new ParticleSystem("particles", 2000, scene);
    particleSystem.particleTexture = new Texture(
      "data:image/png;base64,...",
      scene
    );
    particleSystem.emitter = new Vector3(xPos, 0, 0);
    particleSystem.minEmitBox = new Vector3(-0.5, -4, -0.5);
    particleSystem.maxEmitBox = new Vector3(0.5, 4, 0.5);
    particleSystem.color1 = color.toColor4();
    particleSystem.color2 = color.scale(0.8).toColor4();
    particleSystem.colorDead = color.scale(0.5).toColor4(0);
    particleSystem.minSize = 0.02;
    particleSystem.maxSize = 0.05;
    particleSystem.minLifeTime = 2.0;
    particleSystem.maxLifeTime = 5.0;
    particleSystem.emitRate = 50;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new Vector3(0, -0.1, 0);
    particleSystem.direction1 = new Vector3(-0.5, -0.5, -0.5);
    particleSystem.direction2 = new Vector3(0.5, 0.5, 0.5);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.3;
    particleSystem.updateSpeed = 0.01;
    particleSystem.start();
    return particleSystem;
  };

  const calculateViscosity = (fluidType, temp) => {
    return fluidType === "oil" 
      ? 5 + (100 - temp) * 0.2 
      : 1 + (30 - Math.min(temp, 30)) * 0.05;
  };

  const updateParticles = (particleSystem, viscosity) => {
    particleSystem.updateSpeed = 0.01 * viscosity;
    particleSystem.emitRate = 100 / viscosity;
    particleSystem.gravity.y = -0.1 / viscosity;
  };

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <canvas ref={reactCanvas} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
      
      <div style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: "15px",
        color: "white",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ marginTop: 0 }}>Simulación de Viscosidad</h2>
          <button
            onClick={onBack}
            style={{
              padding: "8px 15px",
              backgroundColor: "#333",
              border: "1px solid #555",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Volver
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#ffcc00" }}>
              Temperatura Aceite: {oilTemperature}°C
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={oilTemperature}
              onChange={(e) => setOilTemperature(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#0066cc" }}>
              Temperatura Agua: {waterTemperature}°C
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={waterTemperature}
              onChange={(e) => setWaterTemperature(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={() => setSelectedTube("oil")}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: selectedTube === "oil" ? "#ffcc00" : "#555",
              border: "none",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Tubo de Aceite
          </button>
          <button
            onClick={() => setSelectedTube("water")}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: selectedTube === "water" ? "#0066cc" : "#555",
              border: "none",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Tubo de Agua
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          <p style={{ margin: "5px 0" }}>
            <strong style={{ color: "#ffcc00" }}>Aceite:</strong> Alta viscosidad, que disminuye notablemente con la temperatura.
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong style={{ color: "#0066cc" }}>Agua:</strong> Baja viscosidad, que cambia menos con la temperatura.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViscositySimulation;