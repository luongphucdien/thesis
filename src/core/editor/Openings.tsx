import { Addition, Base, Geometry, Subtraction } from "@react-three/csg"
import { useRef } from "react"
import { Color, Euler, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { COLOR, CustomObject } from "../ObjectInterface"

interface OpeningProps {
    angle: number
    dimension: [width: number, height: number]
    position: Vector3
    color: string
    onClick: (obj: CustomObject) => void
}

interface DoorProps extends OpeningProps {}

export const Door = (props: DoorProps) => {
    const { angle, dimension, position, color, onClick } = props

    const width = dimension[0]
    const height = dimension[1]

    const ref = useRef<Mesh>(null!)

    const handlePointerIn = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(
            COLOR.SELECT
        )
    }

    const handlePointerOut = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(
            color || COLOR.DEFAULT
        )
    }

    return (
        <>
            <mesh
                position={new Vector3(position.x, position.y, position.z)}
                rotation={[0, angle, 0]}
                onPointerEnter={handlePointerIn}
                onPointerOut={handlePointerOut}
                ref={ref}
                onClick={() =>
                    onClick({
                        angle: angle,
                        color: color,
                        dimension: [...dimension, 0],
                        name: "",
                        position: position,
                    })
                }
            >
                <meshStandardMaterial
                    roughness={0}
                    metalness={0.3}
                    color={color || COLOR.DEFAULT}
                />
                <Geometry>
                    <Base scale={1}>
                        <boxGeometry args={[width, height, 0.4]} />
                    </Base>

                    <Subtraction scale={[0.78, 1, 5]} position={[0, -0.1, 0]}>
                        <boxGeometry args={[width, height, 0.2]} />
                    </Subtraction>

                    <Addition>
                        <boxGeometry args={[width, height, 0.05]} />
                    </Addition>

                    <Addition position={[width / 3.5, 0, width / 10]}>
                        <sphereGeometry args={[width / 15]} />
                    </Addition>

                    <Addition position={[width / 3.5, 0, -width / 10]}>
                        <sphereGeometry args={[width / 15]} />
                    </Addition>

                    <Addition
                        position={[width / 3.5, 0, 0]}
                        rotation={new Euler(Math.PI / 2, 0, 0)}
                    >
                        <cylinderGeometry
                            args={[width / 25, width / 25, width / 5]}
                        />
                    </Addition>
                </Geometry>
            </mesh>
        </>
    )
}

interface WindowProps extends OpeningProps {}

export const Window = (props: WindowProps) => {
    const { angle, color, dimension, position } = props

    const width = dimension[0]
    const height = dimension[1]

    const ref = useRef<Mesh>(null!)

    const handlePointerIn = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(
            COLOR.SELECT
        )
    }

    const handlePointerOut = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(
            color || COLOR.DEFAULT
        )
    }

    return (
        <>
            <mesh
                position={new Vector3(position.x, position.y, position.z)}
                rotation={[0, angle, 0]}
                ref={ref}
                onPointerEnter={handlePointerIn}
                onPointerOut={handlePointerOut}
            >
                <meshStandardMaterial
                    roughness={0}
                    metalness={0.3}
                    color={color || COLOR.DEFAULT}
                />
                <Geometry>
                    <Base scale={1}>
                        <boxGeometry args={[width, height, 0.4]} />
                    </Base>

                    <Subtraction scale={[0.9, 0.9, 5]} position={[0, 0, 0]}>
                        <boxGeometry args={[width, height, 0.2]} />
                    </Subtraction>

                    <Addition>
                        <boxGeometry args={[width, height, 0.05]} />
                    </Addition>

                    <Addition>
                        <boxGeometry args={[width / 10, height, 0.2]} />
                    </Addition>

                    <Addition>
                        <boxGeometry args={[width, height / 10, 0.2]} />
                    </Addition>
                </Geometry>
            </mesh>
        </>
    )
}
