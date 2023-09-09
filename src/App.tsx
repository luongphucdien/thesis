import { Text } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { ARButton, Controllers, XR } from "@react-three/xr"
function App() {
    return (
        <>
            <ARButton />
            <Canvas>
                <XR referenceSpace="local">
                    <ambientLight />
                    <mesh>
                        <Text
                            anchorX="center"
                            anchorY="middle"
                            color="#000"
                            fontSize={0.1}
                            position={[0, 0, 0.06]}
                        >
                            Test
                        </Text>
                    </mesh>
                    <pointLight position={[10, 10, 10]} />
                    <Controllers />
                </XR>
            </Canvas>
        </>
    )
}

export default App
