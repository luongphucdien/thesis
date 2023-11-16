import { Addition, Base, Geometry, Subtraction } from "@react-three/csg"
import { useRef } from "react"
import { Color, Euler, Mesh, MeshBasicMaterial } from "three"
import { Button } from "../../components/button"
import { useToggle } from "../../util/useToggle"
import { distance, radFromTwoPoints } from "../ARScene/geometryUtils"
import { InfoBoard } from "./InfoBoard"

interface OpeningProps {
    positions: number[]
    groundY: number
}

const COLOR_SELECT = "#f87171"

const useCalculation = (positions: number[], groundY: number) => {
    const roots = {
        A: { x: positions[0], y: positions[2] },
        B: { x: positions[3], y: positions[5] },
    }

    const width = distance(roots.A, roots.B)
    const height = positions[7] - groundY

    const angle = -parseFloat(radFromTwoPoints(roots.A, roots.B).toFixed(3))

    const position = {
        x: (roots.A.x + roots.B.x) / 2,
        y: (roots.A.y + roots.B.y) / 2,
    }

    return { width, height, angle, position }
}

interface DoorProps extends OpeningProps {}

export const Door = (props: DoorProps) => {
    const { positions, groundY } = props

    const { angle, height, position, width } = useCalculation(
        positions,
        groundY
    )

    const color = "#94a3b8"

    const ref = useRef<Mesh>(null!)

    const handlePointerIn = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(
            COLOR_SELECT
        )
    }

    const handlePointerOut = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(color)
    }

    const infoRef = useRef<HTMLDivElement>(null!)
    const { state, toggle } = useToggle()

    return (
        <>
            <mesh
                position={[position.x, groundY + height / 2, position.y]}
                rotation={[0, angle, 0]}
                onPointerEnter={handlePointerIn}
                onPointerOut={handlePointerOut}
                onClick={toggle}
                ref={ref}
            >
                <meshStandardMaterial
                    roughness={0}
                    metalness={0.3}
                    color={color}
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

            {state && (
                <InfoBoard onClose={toggle}>
                    <div
                        className="flex flex-col gap-2 text-neutral-100"
                        ref={infoRef}
                    >
                        <p>Type: Door</p>

                        <div className="whitespace-nowrap">
                            <p>Dimension</p>
                            <p>Width: {width.toFixed(3)}m</p>
                            <p>Height: {height.toFixed(3)}m</p>
                            <p>Offset from ground: {0}m</p>
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
                    </div>
                </InfoBoard>
            )}
        </>
    )
}

interface WindowProps extends OpeningProps {}
export const Window = (props: WindowProps) => {
    const { positions, groundY } = props
    const groundOffset = positions[1]

    const { angle, height, position, width } = useCalculation(
        positions,
        groundY
    )

    const color = "#94a3b8"

    const ref = useRef<Mesh>(null!)

    const handlePointerIn = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(
            COLOR_SELECT
        )
    }

    const handlePointerOut = () => {
        ;(ref.current.material as MeshBasicMaterial).color = new Color(color)
    }

    const { state, toggle } = useToggle()
    const infoRef = useRef<HTMLDivElement>(null!)

    return (
        <>
            <mesh
                position={[
                    position.x,
                    groundY + groundOffset + height / 2,
                    position.y,
                ]}
                rotation={[0, angle, 0]}
                ref={ref}
                onPointerEnter={handlePointerIn}
                onPointerOut={handlePointerOut}
                onClick={toggle}
            >
                <meshStandardMaterial
                    roughness={0}
                    metalness={0.3}
                    color={color}
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

            {state && (
                <InfoBoard onClose={toggle}>
                    <div
                        className="flex flex-col gap-2 text-neutral-100"
                        ref={infoRef}
                    >
                        <p>Type: Window</p>

                        <div className="whitespace-nowrap">
                            <p>Dimension</p>
                            <p>Width: {width.toFixed(3)}m</p>
                            <p>Height: {height.toFixed(3)}m</p>
                            <p>Offset from ground: {groundOffset}m</p>
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
                    </div>
                </InfoBoard>
            )}
        </>
    )
}
