import { Base, Geometry, Subtraction } from "@react-three/csg"
import { distance, radFromTwoPoints } from "../ARScene/geometryUtils"

interface RoomProps {
    positions: number[]
    groundY: number
}

export const Room = (props: RoomProps) => {
    const { positions, groundY } = props

    const roots = {
        A: {
            x: positions[0],
            y: positions[2],
        },

        B: {
            x: positions[3],
            y: positions[5],
        },

        C: {
            x: positions[6],
            y: positions[8],
        },
    }

    const height = positions[13] - groundY
    const width = distance(roots.A, roots.B)
    const depth = distance(roots.B, roots.C)

    const position = {
        x: (roots.A.x + roots.C.x) / 2,
        y: (roots.A.y + roots.C.y) / 2,
    }

    const angle = radFromTwoPoints(roots.A, roots.B)

    return (
        <>
            <mesh
                receiveShadow
                position={[position.x, groundY + height / 2, position.y]}
                onUpdate={(self) => self.rotateY(-angle)}
            >
                <Geometry>
                    <Base scale={1}>
                        <boxGeometry args={[width, height, depth]} />
                    </Base>

                    <Subtraction scale={0.99} position={[0, 0.015, 0]}>
                        <boxGeometry args={[width, height, depth]} />
                    </Subtraction>
                </Geometry>

                <meshStandardMaterial roughness={0} metalness={0.3} />
            </mesh>

            <pointLight
                position={[position.x, groundY + height + 1, position.y]}
                intensity={50}
            />
        </>
    )
}
