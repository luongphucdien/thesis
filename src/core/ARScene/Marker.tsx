import { Vector3 } from "three"

export const Marker = (props: { name: string; position: Vector3 }) => {
    const { name, position } = props
    return (
        <group>
            <mesh name={name} position={position}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial color={"blue"} />
            </mesh>
        </group>
    )
}
