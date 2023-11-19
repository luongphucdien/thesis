import { useRef } from "react"
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three"
import { COLOR, CustomObject } from "../ObjectInterface"

interface ObjectInterface {
    dimension: [width: number, height: number, depth: number]
    position: Vector3
    angle: number
    name: string
    color: string
    onClick: (obj: CustomObject) => void
}

export const SelfDefinedObject = (props: ObjectInterface) => {
    const { angle, name, position, dimension, color, onClick } = props

    const thisMeshRef = useRef<Mesh>(null!)

    const handlePointerIn = () => {
        ;(thisMeshRef.current.material as MeshStandardMaterial).color =
            new Color(COLOR.SELECT)
    }

    const handlePointerOut = () => {
        ;(thisMeshRef.current.material as MeshStandardMaterial).color =
            new Color(color || COLOR.DEFAULT)
    }

    return (
        <>
            <mesh
                name={name}
                position={position}
                rotation={[0, angle, 0]}
                ref={thisMeshRef}
                onPointerEnter={handlePointerIn}
                onPointerOut={handlePointerOut}
                onClick={(e) => {
                    onClick({
                        angle: angle,
                        color: color || COLOR.DEFAULT,
                        dimension: dimension,
                        name: name,
                        position: position,
                    })
                    e.stopPropagation()
                }}
            >
                <boxGeometry args={dimension} />
                <meshStandardMaterial color={color || COLOR.DEFAULT} />
            </mesh>
        </>
    )
}
