import React, { useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { useGame, SCREENS } from "../context/GameContext";
import { saveMap } from "../utils/MapStorage";

// Extracted height math so we can sample it for placing objects
function getHeightAt(x, z, frequency, amplitude, flattenRadius) {
  let y =
    Math.sin(x * frequency) * amplitude +
    Math.cos(z * frequency) * amplitude +
    Math.sin((x + z) * (frequency * 0.5)) * (amplitude * 1.5);

  const distFromCenter = Math.sqrt(x * x + z * z);
  if (distFromCenter < flattenRadius) {
    const flattenFactor = distFromCenter / flattenRadius;
    const smooth = flattenFactor * flattenFactor * (3 - 2 * flattenFactor);
    y = y * smooth;
  }
  return y;
}

// Procedural generation function
function generateTerrainGeometry(
  size,
  resolution,
  frequency,
  amplitude,
  flattenRadius
) {
  const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
  geo.rotateX(-Math.PI / 2); // Make flat on XZ plane

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const y = getHeightAt(x, z, frequency, amplitude, flattenRadius);
    pos.setY(i, y);
  }

  geo.computeVertexNormals();
  return geo;
}

// Generate random objects based on density
function generateDecorations(
  size,
  frequency,
  amplitude,
  flattenRadius,
  treeDensity,
  houseCount
) {
  const trees = [];
  const houses = [];

  // Generate Houses (spawn them around the lake edge)
  for (let i = 0; i < houseCount; i++) {
    const angle = (Math.PI * 2 * i) / houseCount;
    // Place them just outside the flattenRadius
    const r = flattenRadius + 5 + Math.random() * 10;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = getHeightAt(x, z, frequency, amplitude, flattenRadius);

    houses.push({
      position: [x, y, z],
      rotation: [0, angle + Math.PI, 0], // Face the lake
    });
  }

  // Generate Trees (scattered everywhere except the lake)
  // A simple grid check for density
  const step = 10;
  const halfSize = size / 2;
  for (let x = -halfSize; x <= halfSize; x += step) {
    for (let z = -halfSize; z <= halfSize; z += step) {
      if (Math.random() < treeDensity) {
        const distFromCenter = Math.sqrt(x * x + z * z);
        // Don't spawn trees in the water
        if (distFromCenter > flattenRadius) {
          // Add some jitter
          const jx = x + (Math.random() - 0.5) * step;
          const jz = z + (Math.random() - 0.5) * step;
          // Clamp to size
          if (Math.abs(jx) <= halfSize && Math.abs(jz) <= halfSize) {
            const y = getHeightAt(jx, jz, frequency, amplitude, flattenRadius);
            // Don't spawn on super steep cliffs if we can help it (basic check)
            trees.push({
              position: [jx, y, jz],
              scale: 0.8 + Math.random() * 0.4,
              rotation: [0, Math.random() * Math.PI * 2, 0],
            });
          }
        }
      }
    }
  }

  return { trees, houses };
}

export function MapEditorScreen() {
  const { goTo } = useGame();

  // Terrain Settings
  const [size, setSize] = useState(400);
  const [resolution, setResolution] = useState(128);
  const [frequency, setFrequency] = useState(0.04);
  const [amplitude, setAmplitude] = useState(6);
  const [flattenRadius, setFlattenRadius] = useState(40);

  // Load the user's aesthetic house model
  const houseModel = useGLTF("/assets/shared/house.glb");

  // Decoration Settings
  const [treeDensity, setTreeDensity] = useState(0.15);
  const [houseCount, setHouseCount] = useState(5);
  const [houseScale, setHouseScale] = useState(0.03);
  const [houseYOffset, setHouseYOffset] = useState(-0.5);

  // Save Settings
  const [mapName, setMapName] = useState("My Custom Map");
  const [isSaving, setIsSaving] = useState(false);

  const groupRef = useRef();

  const terrainGeo = useMemo(() => {
    return generateTerrainGeometry(
      size,
      resolution,
      frequency,
      amplitude,
      flattenRadius
    );
  }, [size, resolution, frequency, amplitude, flattenRadius]);

  const decorations = useMemo(() => {
    return generateDecorations(
      size,
      frequency,
      amplitude,
      flattenRadius,
      treeDensity,
      houseCount
    );
  }, [size, frequency, amplitude, flattenRadius, treeDensity, houseCount]);

  const handleExportGLB = () => {
    if (!groupRef.current) return;

    const exporter = new GLTFExporter();
    exporter.parse(
      groupRef.current,
      (gltf) => {
        // We export as .glb (binary) by passing an ArrayBuffer
        const blob = new Blob([gltf], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.download = `${mapName.replace(/\s+/g, "_").toLowerCase()}.glb`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error("GLTF Export Error", error);
      },
      { binary: true } // GLB format
    );
  };

  const handleSaveToBrowser = () => {
    if (!groupRef.current) return;
    setIsSaving(true);

    const exporter = new GLTFExporter();
    exporter.parse(
      groupRef.current,
      async (gltf) => {
        try {
          const blob = new Blob([gltf], { type: "application/octet-stream" });
          await saveMap(mapName, blob);
          alert(
            "Map saved successfully! You can now load it from the Region Select Lobby."
          );
        } catch (error) {
          alert(error.message);
        } finally {
          setIsSaving(false);
        }
      },
      (error) => {
        console.error("GLTF Parse Error", error);
        setIsSaving(false);
      },
      { binary: true }
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        background: "var(--px-sky-deep)",
        color: "var(--px-text)",
        fontFamily: "var(--px-font-sans)",
      }}
    >
      {/* ── Left Sidebar: Controls ── */}
      <div
        style={{
          width: "380px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          overflowY: "auto",
          background: "var(--px-panel-solid)",
          borderRight: "1px solid var(--px-border)",
          boxShadow: "var(--px-shadow)",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => goTo(SCREENS.dashboard)}
            style={{
              padding: "8px 12px",
              background: "var(--px-panel)",
              color: "var(--px-text)",
              border: "1px solid var(--px-border)",
              borderRadius: "var(--px-radius-sm)",
              cursor: "pointer",
              fontSize: "var(--px-text-sm)",
            }}
          >
            ← Back
          </button>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--px-font-display)",
              fontSize: "1.5rem",
              color: "var(--px-accent)",
            }}
          >
            Map Baker
          </h2>
        </div>

        {/* Terrain Generator Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--px-panel)",
            padding: "20px",
            borderRadius: "var(--px-radius)",
            border: "1px solid var(--px-border)",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "var(--px-text-md)",
              color: "white",
              borderBottom: "1px solid var(--px-border)",
              paddingBottom: "12px",
            }}
          >
            Terrain Settings
          </h3>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Size (Units)</span>
              <span style={{ color: "var(--px-accent)" }}>{size}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Resolution (Verts)</span>
              <span style={{ color: "var(--px-accent)" }}>{resolution}</span>
            </div>
            <input
              type="range"
              min="16"
              max="256"
              step="16"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Frequency (Bumps)</span>
              <span style={{ color: "var(--px-accent)" }}>
                {frequency.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.01"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Amplitude (Height)</span>
              <span style={{ color: "var(--px-accent)" }}>{amplitude}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Center Flatten Radius</span>
              <span style={{ color: "var(--px-accent)" }}>{flattenRadius}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={flattenRadius}
              onChange={(e) => setFlattenRadius(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
        </div>

        {/* Decorations Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--px-panel)",
            padding: "20px",
            borderRadius: "var(--px-radius)",
            border: "1px solid var(--px-border)",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "var(--px-text-md)",
              color: "white",
              borderBottom: "1px solid var(--px-border)",
              paddingBottom: "12px",
            }}
          >
            Decorations & POIs
          </h3>

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Forest Density</span>
              <span style={{ color: "var(--px-accent)" }}>
                {(treeDensity * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={treeDensity}
              onChange={(e) => setTreeDensity(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Village Size (Houses)</span>
              <span style={{ color: "var(--px-accent)" }}>{houseCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={houseCount}
              onChange={(e) => setHouseCount(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>House Scale</span>
              <span style={{ color: "var(--px-accent)" }}>
                {houseScale.toFixed(3)}
              </span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.1"
              step="0.005"
              value={houseScale}
              onChange={(e) => setHouseScale(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              fontSize: "var(--px-text-sm)",
              color: "var(--px-text-muted)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>House Y-Offset</span>
              <span style={{ color: "var(--px-accent)" }}>
                {houseYOffset.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={houseYOffset}
              onChange={(e) => setHouseYOffset(Number(e.target.value))}
              style={{ accentColor: "var(--px-accent)" }}
            />
          </label>
        </div>

        {/* Save/Export Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "var(--px-panel)",
            padding: "20px",
            borderRadius: "var(--px-radius)",
            border: "1px solid var(--px-border)",
          }}
        >
          <h3
            style={{
              margin: "0",
              fontSize: "var(--px-text-md)",
              color: "white",
              borderBottom: "1px solid var(--px-border)",
              paddingBottom: "12px",
            }}
          >
            Save & Export
          </h3>

          <input
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
            placeholder="Map Name"
            style={{
              padding: "12px 14px",
              borderRadius: "var(--px-radius-sm)",
              border: "1px solid var(--px-border)",
              background: "rgba(0,0,0,0.3)",
              color: "white",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--px-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--px-border)")}
          />

          <button
            onClick={handleSaveToBrowser}
            disabled={isSaving}
            style={{
              padding: "14px",
              background: "var(--px-accent)",
              color: "black",
              border: "none",
              borderRadius: "var(--px-radius-sm)",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              opacity: isSaving ? 0.7 : 1,
              boxShadow: "var(--px-glow)",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.98)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isSaving ? "Saving..." : "Save to Browser Storage"}
          </button>

          <button
            onClick={handleExportGLB}
            style={{
              padding: "14px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "1px solid var(--px-border)",
              borderRadius: "var(--px-radius-sm)",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
          >
            Download .GLB File
          </button>
        </div>
      </div>

      {/* ── Main 3D Viewport ── */}
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas camera={{ position: [0, 80, 120], fov: 60 }}>
          <color attach="background" args={["#87CEEB"]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[100, 150, 50]}
            intensity={1.5}
            castShadow
          />

          <group ref={groupRef}>
            {/* Terrain Mesh */}
            <mesh geometry={terrainGeo}>
              <meshStandardMaterial color="#4CAF50" flatShading />
            </mesh>

            {/* Water Plane */}
            {flattenRadius > 0 && (
              <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[flattenRadius * 2, flattenRadius * 2]} />
                <meshStandardMaterial
                  color="#2196F3"
                  opacity={0.8}
                  transparent
                />
              </mesh>
            )}

            {/* Generated Trees */}
            {decorations.trees.map((tree, idx) => (
              <group
                key={`tree-${idx}`}
                position={tree.position}
                rotation={tree.rotation}
                scale={tree.scale}
              >
                {/* Trunk */}
                <mesh position={[0, 1, 0]}>
                  <cylinderGeometry args={[0.3, 0.4, 2]} />
                  <meshStandardMaterial color="#5D4037" />
                </mesh>
                {/* Leaves */}
                <mesh position={[0, 3, 0]}>
                  <coneGeometry args={[2, 4, 8]} />
                  <meshStandardMaterial color="#388E3C" />
                </mesh>
              </group>
            ))}

            {/* Generated Aesthetic Houses */}
            {decorations.houses.map((house, idx) => (
              <group
                key={`house-${idx}`}
                position={[
                  house.position[0],
                  house.position[1] + houseYOffset,
                  house.position[2],
                ]}
                rotation={house.rotation}
              >
                <Clone object={houseModel.scene} scale={houseScale} />
              </group>
            ))}
          </group>

          {/* Helper Grid (not exported) */}
          <gridHelper args={[size, size / 10]} />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/assets/shared/house.glb");
