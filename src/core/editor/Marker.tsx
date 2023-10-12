import { Billboard, Text } from "@react-three/drei"
import { useRef, useState } from "react"
import { Mesh, Vector3 } from "three"

interface MarkerRef {
    position: Vector3
    name: string
    color?: string
}
export const Marker = (props: MarkerRef) => {
    const { position, name, color } = props

    const markerRef = useRef<Mesh>(null!)

    const [isHovered, setIsHovered] = useState(false)

    const handlePointerOver = () => {
        setIsHovered(true)
    }

    const handlePointerOut = () => {
        setIsHovered(false)
    }

    return (
        <group>
            {isHovered && (
                <Billboard follow position={[position.x, 1, position.z]}>
                    <Text color={"rgb(99,102,241)"}>{name}</Text>
                </Billboard>
            )}

            <mesh
                rotation={[Math.PI * -0.5, 0, 0]}
                position={position}
                onPointerOver={handlePointerOver}
                onPointerLeave={handlePointerOut}
                ref={markerRef}
                name={name}
            >
                <planeGeometry />
                <meshBasicMaterial color={color ? color : "blue"} />
            </mesh>
        </group>
    )
}
