const VISTA_Y = -28;

function Patch({
  accent,
  color,
  glow,
  position,
  rotation = 0,
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh>
        <boxGeometry args={[11, 0.18, 7.2]} />
        <meshStandardMaterial
          color={color}
          depthWrite={false}
          fog
          opacity={0.52}
          roughness={0.86}
          transparent
        />
      </mesh>
      <mesh position={[2.2, 0.12, -1.2]}>
        <boxGeometry args={[3.4, 0.12, 2.1]} />
        <meshStandardMaterial
          color={accent}
          depthWrite={false}
          fog
          opacity={0.62}
          roughness={0.8}
          transparent
        />
      </mesh>
      {glow && (
        <pointLight
          color={glow}
          distance={12}
          intensity={0.85}
          position={[0, 2, 0]}
        />
      )}
      <mesh position={[-3.8, 0.22, 1.8]}>
        <boxGeometry args={[1.8, 0.16, 1.2]} />
        <meshStandardMaterial
          color="#ffffff"
          depthWrite={false}
          fog
          opacity={0.16}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function SkyBelowVista() {
  return (
    <group>
      <Patch
        accent="#2f9b31"
        color="#4baa3d"
        position={[-38, VISTA_Y, -18]}
        rotation={0.18}
      />
      <Patch
        accent="#f0dda0"
        color="#d0b76a"
        position={[36, VISTA_Y - 1.8, -16]}
        rotation={-0.22}
      />
      <Patch
        accent="#ff5a12"
        color="#1b1215"
        glow="#ff6b1a"
        position={[42, VISTA_Y - 3.4, 24]}
        rotation={0.36}
      />
      <Patch
        accent="#d98cff"
        color="#5fbf5a"
        glow="#d98cff"
        position={[-40, VISTA_Y - 2.4, 25]}
        rotation={-0.35}
      />
      <Patch
        accent="#d7f0fb"
        color="#70767a"
        position={[0, VISTA_Y - 5.6, 48]}
        rotation={0.05}
      />
    </group>
  );
}
