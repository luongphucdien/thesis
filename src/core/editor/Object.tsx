import { useRef } from "react"
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three"
import { Button } from "../../components/button"
import { useToggle } from "../../util/useToggle"
import { COLOR, CustomObject } from "../ObjectInterface"
import { InfoBoard } from "./InfoBoard"

interface ObjectInterface {
    dimension: [width: number, height: number, depth: number]
    position: Vector3
    angle: number
    name: string
    color: string
    deleteCallback: (objName: string) => void
    onClick: (obj: CustomObject) => void
}

export const SelfDefinedObject = (props: ObjectInterface) => {
    const { angle, name, position, dimension, deleteCallback, color, onClick } =
        props

    const thisMeshRef = useRef<Mesh>(null!)

    const { state, toggle } = useToggle()
    const infoRef = useRef<HTMLDivElement>(null!)

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
                onClick={() =>
                    onClick({
                        angle: angle,
                        color: color || COLOR.DEFAULT,
                        dimension: dimension,
                        name: name,
                        position: position,
                    })
                }
            >
                <boxGeometry args={dimension} />
                <meshStandardMaterial color={color || COLOR.DEFAULT} />
            </mesh>

            {state && (
                <InfoBoard
                    onClose={toggle}
                    position={[position.x, position.y + 3, position.z]}
                >
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
                            <p>Depth: {dimension[2]}m</p>
                        </div>

                        <p className="whitespace-nowrap">
                            Position:{" "}
                            {`[${position.x.toFixed(3)}, ${position.y.toFixed(
                                3
                            )}, ${position.z.toFixed(3)}]`}
                        </p>

                        <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-indigo-300 p-4">
                            <p className="text-lg font-semibold">Color:</p>

                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    defaultValue={color || COLOR.DEFAULT}
                                />
                                <p>{color || COLOR.DEFAULT}</p>
                            </div>

                            <Button variant="non opaque">Change color</Button>
                        </div>

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
