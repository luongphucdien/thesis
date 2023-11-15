import { ThreeEvent, useThree } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, Raycaster, Vector2, Vector3 } from "three"
import { distance, radFromTwoPoints } from "../ARScene/geometryUtils"

export const GroundSurface = (props: {
    roomPositions: number[]
    containerRef: React.RefObject<HTMLDivElement>
    groundY: number
    object: {
        width: number
        height: number
        depth: number
        name: string
    }
    onClick: () => void
}) => {
    const { roomPositions, containerRef, groundY, object, onClick } = props
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
            if (intersect.object.name === "valid") {
                const highlighterPos = new Vector3().copy(intersect.point)
                highlighter.current.position.set(
                    highlighterPos.x,
                    groundY + 1 / 2,
                    highlighterPos.z
                )
            }
        })

        const objName = intersects[1].object.name
        const floorRegEx = new RegExp("^<floor>:[^ ]+$")
    }

    return (
        <>
            <mesh
                position={[position.x, groundY + 0.02, position.y]}
                rotation={[-Math.PI / 2, 0, angle]}
                onPointerMove={handleOnMouseMove}
                onClick={onClick}
                name="valid"
            >
                <planeGeometry args={[width, depth]} />
                <meshNormalMaterial />
            </mesh>

            <mesh ref={highlighter} rotation={[0, angle, 0]} name={object.name}>
                <boxGeometry
                    args={[object.width, object.height, object.depth]}
                />
                <meshNormalMaterial transparent opacity={0.4} />
            </mesh>
        </>
    )
}
