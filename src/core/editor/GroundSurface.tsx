import { Base, Geometry, Subtraction } from "@react-three/csg"
import { ThreeEvent, useThree } from "@react-three/fiber"
import { useRef } from "react"
import {
    Color,
    Group,
    Mesh,
    MeshStandardMaterial,
    Raycaster,
    Vector2,
    Vector3,
} from "three"
import { distance, radFromTwoPoints } from "../ARScene/geometryUtils"

const color = {
    VALID: "#4ade80",
    INVALID: "#fb7185",
}

export const GroundSurface = (props: {
    roomPositions: number[]
    containerRef: React.RefObject<HTMLDivElement>
    groundY: number
    object: {
        width: number
        height: number
        depth: number
        name: string
        rotation: number
    }
    onClick: (objPos: Vector3, angle: number) => void
    customModel?: Group
}) => {
    const {
        roomPositions,
        containerRef,
        groundY,
        object,
        onClick,
        customModel,
    } = props
    const roots = {
        A: {
            x: roomPositions[0],
            y: roomPositions[2],
        },

        B: {
            x: roomPositions[3],
            y: roomPositions[5],
        },

        C: {
            x: roomPositions[6],
            y: roomPositions[8],
        },
    }

    const position = {
        x: (roots.A.x + roots.C.x) / 2,
        y: (roots.A.y + roots.C.y) / 2,
    }

    const angle = -radFromTwoPoints(roots.A, roots.B)

    const width = distance(roots.A, roots.B)
    const depth = distance(roots.B, roots.C)

    const highlighter = useRef<Mesh>(null!)

    const { camera, scene } = useThree()

    const mousePos = new Vector2()
    const raycaster = new Raycaster()

    const handleOnMouseMove = (event: ThreeEvent<PointerEvent>) => {
        mousePos.x = containerRef.current
            ? (((event.clientX / window.innerWidth) * 2 - 1) * 100) / 100
            : 0

        mousePos.y = containerRef.current
            ? ((-(event.clientY / window.innerHeight) * 2 + 1) * 100) / 100
            : 0

        raycaster.setFromCamera(mousePos, camera)
        const intersects = raycaster.intersectObjects(scene.children)

        intersects.forEach((intersect) => {
            if (intersect.object.name === "ground") {
                const highlighterPos = new Vector3().copy(intersect.point)
                highlighter.current.position.set(
                    highlighterPos.x,
                    groundY + object.height / 2,
                    highlighterPos.z
                )
            }

            if (intersect.object.name === "valid") {
                ;(highlighter.current.material as MeshStandardMaterial).color =
                    new Color(color.VALID)
            }

            if (intersect.object.name === "invalid") {
                ;(highlighter.current.material as MeshStandardMaterial).color =
                    new Color(color.INVALID)
            }
        })
    }

    return (
        <>
            <mesh
                position={[position.x, groundY + 0.02, position.y]}
                rotation={[-Math.PI / 2, 0, angle]}
                onPointerMove={handleOnMouseMove}
                onClick={() => {
                    onClick(highlighter.current.position, angle)
                }}
                name="ground"
            >
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial visible={false} />
            </mesh>

            <group>
                <mesh
                    position={[position.x, groundY + 0.02, position.y]}
                    rotation={[-Math.PI / 2, 0, angle]}
                    name="valid"
                >
                    <planeGeometry
                        args={[width - object.width, depth - object.depth]}
                    />
                    <meshStandardMaterial color={color.VALID} />
                </mesh>

                <mesh
                    position={[position.x, groundY + 0.02, position.y]}
                    rotation={[-Math.PI / 2, 0, angle]}
                    name="invalid"
                >
                    <meshStandardMaterial color={color.INVALID} />

                    <Geometry>
                        <Base scale={1}>
                            <planeGeometry args={[width, depth]} />
                        </Base>

                        <Subtraction>
                            <planeGeometry
                                args={[
                                    width - object.width,
                                    depth - object.depth,
                                ]}
                            />
                        </Subtraction>
                    </Geometry>
                </mesh>
            </group>

            {customModel ? (
                <mesh
                    ref={highlighter}
                    rotation={[0, angle, 0]}
                    name={object.name}
                >
                    <primitive object={customModel} />
                </mesh>
            ) : (
                <mesh
                    ref={highlighter}
                    rotation={[0, angle + object.rotation, 0]}
                    name={object.name}
                >
                    <boxGeometry
                        args={[object.width, object.height, object.depth]}
                    />
                    <meshStandardMaterial
                        color={color.VALID}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            )}
        </>
    )
}
