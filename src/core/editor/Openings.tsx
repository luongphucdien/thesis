import { Addition, Base, Geometry, Subtraction } from "@react-three/csg"
import { distance, radFromTwoPoints } from "../ARScene/geometryUtils"

interface OpeningProps {
    positions: number[]
    groundOffset: number
    groundY: number
}

const Opening = (props: OpeningProps) => {
    const { groundOffset, positions, groundY } = props

    const rootPoints = {
        A: { x: positions[0], y: positions[2] },
        B: { x: positions[3], y: positions[5] },
    }

    const width = distance(rootPoints.A, rootPoints.B)
    const height = positions[7] - groundY

    const angle = parseFloat(
        radFromTwoPoints(rootPoints.A, rootPoints.B).toFixed(3)
    )

    const position = {
        x: (rootPoints.A.x + rootPoints.B.x) / 2,
        y: (rootPoints.A.y + rootPoints.B.y) / 2,
    }

    return (
        <mesh
            position={[
                position.x,
                groundY + groundOffset + height / 2,
                position.y,
            ]}
            onUpdate={(self) => {
                self.rotateY(-angle)
                console.log(position)
            }}
        >
            <Geometry useGroups>
                <Base scale={1}>
                    <boxGeometry args={[width, height, 0.4]} />
                    <meshStandardMaterial
                        roughness={0}
                        metalness={0.3}
                        color={"blue"}
                    />
                </Base>

                <Subtraction scale={[0.7, 0.95, 5]} position={[0, -0.1, 0]}>
                    <boxGeometry args={[width, height, 0.2]} />
                    <meshStandardMaterial
                        roughness={0}
                        metalness={0.3}
                        color={"blue"}
                    />
                </Subtraction>

                <Addition>
                    <boxGeometry args={[width, height, 0.05]} />
                    <meshStandardMaterial
                        roughness={0}
                        metalness={0.3}
                        color={"blue"}
                    />
                </Addition>
            </Geometry>
        </mesh>
    )
}

interface DoorProps extends Omit<OpeningProps, "groundOffset"> {}
export const Door = (props: DoorProps) => {
    return <Opening groundOffset={0} {...props} />
}

interface WindowProps extends OpeningProps {}
export const Window = (props: WindowProps) => {
    return <Opening {...props} />
}
