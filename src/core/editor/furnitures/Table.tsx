import { Mesh } from "three"

interface TableProps {
    dimension: [width: number, height: number, depth: number]
    angle: number
    position?: [x: number, y: number, z: number]
    ref: React.RefObject<Mesh>
}

export const Table = (props: TableProps) => {
    const { dimension, angle, position, ref } = props
    return (
        <mesh position={position} rotation={[0, angle, 0]} ref={ref}>
            <boxGeometry args={dimension} />
            <meshNormalMaterial />
        </mesh>
    )
}
