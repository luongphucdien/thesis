import { Billboard, Html, Text } from "@react-three/drei"
import { ThreeEvent } from "@react-three/fiber"
import { useRef, useState } from "react"
import { IconContext } from "react-icons"
import { IoMdClose } from "react-icons/io"
import { Mesh, Vector3 } from "three"
import { Button } from "../../components/button"
import { useToggle } from "../../util/useToggle"

interface MarkerRef {
    position: Vector3
    name: string
}
export const Marker = (props: MarkerRef) => {
    const { position, name } = props

    const markerRef = useRef<Mesh>(null!)

    const [isHovered, setIsHovered] = useState(false)
    const { state, toggle } = useToggle()

    const handlePointerOver = () => {
        setIsHovered(true)
    }

    const handlePointerOut = () => {
        setIsHovered(false)
    }

    const handleSelect = (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation()
        toggle()
    }

    return (
        <group>
            {isHovered && !state && (
                <Billboard follow position={[position.x, 1, position.z]}>
                    <Text color={"rgb(99,102,241)"}>{name}</Text>
                </Billboard>
            )}

            {state && (
                <Html position={[position.x, 1, position.z]}>
                    <div className="relative rounded-md bg-indigo-600 text-neutral-100">
                        <div className="flex flex-col gap-2 p-2">
                            <span
                                className="cursor-pointer self-end"
                                onClick={toggle}
                            >
                                <IconContext.Provider value={{ size: "20px" }}>
                                    <IoMdClose />
                                </IconContext.Provider>
                            </span>

                            <div className="flex flex-col items-center gap-3">
                                <p>{name}</p>
                                <Button variant="error">Delete</Button>
                            </div>
                        </div>
                    </div>
                </Html>
            )}

            <mesh
                rotation={[Math.PI * -0.5, 0, 0]}
                position={position}
                onPointerOver={handlePointerOver}
                onPointerLeave={handlePointerOut}
                onClick={handleSelect}
                ref={markerRef}
                name={name}
            >
                <planeGeometry />
                <meshBasicMaterial color={"blue"} />
            </mesh>
        </group>
    )
}
