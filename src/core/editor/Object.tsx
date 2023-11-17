import { useRef } from "react"
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three"
import { Button } from "../../components/button"
import { useToggle } from "../../util/useToggle"
import { InfoBoard } from "./InfoBoard"

interface ObjectInterface {
    dimension: [width: number, height: number, depth: number]
    position: Vector3
    angle: number
    name: string
    deleteCallback: (objName: string) => void
}

const COLOR_SELECT = "#f87171"
const COLOR_NORMAL = "#94a3b8"

export const SelfDefinedObject = (props: ObjectInterface) => {
    const { angle, name, position, dimension, deleteCallback } = props

    const thisMeshRef = useRef<Mesh>(null!)

    const { state, toggle } = useToggle()
    const infoRef = useRef<HTMLDivElement>(null!)

    const handleOnClick = () => {
        toggle()
    }

    const handlePointerIn = () => {
        ;(thisMeshRef.current.material as MeshStandardMaterial).color =
            new Color(COLOR_SELECT)
    }

    const handlePointerOut = () => {
        ;(thisMeshRef.current.material as MeshStandardMaterial).color =
            new Color(COLOR_NORMAL)
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
                onClick={handleOnClick}
            >
                <boxGeometry args={dimension} />
                <meshStandardMaterial color={COLOR_NORMAL} />
            </mesh>

            {state && (
                <InfoBoard onClose={toggle}>
                    <div
                        className="flex flex-col gap-2 text-neutral-100"
                        ref={infoRef}
                    >
                        <p className="whitespace-nowrap">Type: Object</p>

                        <p>Name: {name}</p>

                        <div className="whitespace-nowrap">
                            <p>Dimension</p>
                            <p>Width: {dimension[0]}m</p>
                            <p>Height: {dimension[1]}m</p>
                            <p>Height: {dimension[2]}m</p>
                        </div>

                        <p className="whitespace-nowrap">
                            Position:{" "}
                            {`[${position.x.toFixed(3)}, ${position.y.toFixed(
                                3
                            )}, ${position.z.toFixed(3)}]`}
                        </p>

                        <Button
                            variant="non opaque"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    infoRef.current.innerText.replace(
                                        "Copy",
                                        ""
                                    )
                                )
                                alert("Copied!")
                            }}
                        >
                            Copy
                        </Button>

                        <Button
                            variant="error"
                            onClick={() => deleteCallback(name)}
                        >
                            Delete
                        </Button>
                    </div>
                </InfoBoard>
            )}
        </>
    )
}
