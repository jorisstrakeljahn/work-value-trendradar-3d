/**
 * Scene lighting setup
 */
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, -5]} intensity={0.4} />
    </>
  )
}

