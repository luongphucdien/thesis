import { MapControls } from "@react-three/drei"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, Raycaster, Vector2, Vector3 } from "three"

export const ManualMode = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const highlighter = useRef<Mesh>(null!)

    const CustomGrid = () => {
        const { camera, scene } = useThree()

        const mousePos = new Vector2()
        const raycaster = new Raycaster()

        const handleOnMouseMove = (event: ThreeEvent<PointerEvent>) => {
            mousePos.x = containerRef.current
                ? (((event.clientX / window.innerWidth) * 2 - 1) * 100) / 70
                : 0

            mousePos.y = containerRef.current
                ? ((-(event.clientY / window.innerHeight) * 2 + 1) * 100) / 70
                : 0

            raycaster.setFromCamera(mousePos, camera)
            const intersects = raycaster.intersectObjects(scene.children)

            intersects.forEach((intersect) => {
                if (intersect.object.name === "ground") {
                    const highlighterPos = new Vector3()
                        .copy(intersect.point)
                        .floor()
                        .addScalar(0.5)
                    highlighter.current.position.set(
                        highlighterPos.x,
                        0,
                        highlighterPos.z
                    )

                    console.log(highlighterPos)
                }
            })
        }
        return <gridHelper onPointerMove={handleOnMouseMove} args={[20, 20]} />
    }

    return (
        <div className="h-[70vh] w-[70vw]" ref={containerRef}>
            <Canvas camera={{ position: [0, 10, 0] }}>
                <mesh rotation={[Math.PI * -0.5, 0, 0]} name="ground">
                    <planeGeometry args={[20, 20]} />
                    <meshBasicMaterial visible={false} />
                </mesh>

                <mesh
                    position={[0.5, 0, 0.5]}
                    rotation={[Math.PI * -0.5, 0, 0]}
                    ref={highlighter}
                >
                    <planeGeometry />
                    <meshBasicMaterial color={"red"} />
                </mesh>

                <MapControls />
                <CustomGrid />
            </Canvas>
        </div>
    )
}
