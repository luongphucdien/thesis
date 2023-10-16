import { Billboard, Text } from "@react-three/drei"
import { useState } from "react"
import { Vector3Tuple } from "three"

interface FloorProps {
    width: number
    length: number
    position: Vector3Tuple
    key: string
    name: string
}

export const Floor = (props: FloorProps) => {
    const { length, width, key, name, position } = props
    const [isHovered, setIsHovered] = useState(false)
    return (
        <group>
            {isHovered && (
                <Billboard position={[position[0], 1, position[2]]}>
                    <Text color={"rgb(99,102,241)"}>{name}</Text>
                </Billboard>
            )}

            <mesh
                position={position}
                key={key}
                name={name}
                rotation={[Math.PI * -0.5, 0, 0]}
                onPointerOver={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <planeGeometry args={[width, length]} />
                <meshBasicMaterial color={"blue"} />
            </mesh>
        </group>
    )
}
