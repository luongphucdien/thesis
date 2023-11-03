import { Base, Geometry, Subtraction } from "@react-three/csg"
import { Billboard, Grid, Line, Text } from "@react-three/drei"
import { ThreeEvent, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import { Mesh, Raycaster, Vector2, Vector3 } from "three"
import {
    distance,
    findPointMaxDistance,
    normalizedD,
    perpPoints,
    radFromTwoPoints,
} from "../ARScene/geometryUtils"
import { ModeType } from "./ModeType"

interface RoomProps {
    positions: number[]
    groundY: number
    containerRef: React.RefObject<HTMLDivElement>
    showScales: boolean
    boundBoxDimen: [width: number, height: number, depth: number]
    mode: ModeType
}

const COLOR_TEXT = "#404040"

const Ground = (props: {
    position: { x: number; y: number }
    size: [number, number]
    angle: number
    groundY: number
    containerRef: React.RefObject<HTMLDivElement>
    boundBoxDimen: [width: number, height: number, depth: number]
}) => {
    const COLOR_VALID = "#4ade80"
    const COLOR_INVALID = "#f87171"

    const { angle, position, size, containerRef, groundY, boundBoxDimen } =
        props

    const highlighter = useRef<Mesh>(null!)

    const { camera, scene } = useThree()

    const mousePos = new Vector2()
    const raycaster = new Raycaster()

    const handleOnMouseMove = (event: ThreeEvent<PointerEvent>) => {
        mousePos.x = containerRef.current
            ? (((event.clientX / window.innerWidth) * 2 - 1) * 100) / 100
            : 0

        mousePos.y = containerRef.current
            ? ((-(event.clientY / window.innerHeight) * 2 + 1) * 100) / 100
            : 0

        raycaster.setFromCamera(mousePos, camera)
        const intersects = raycaster.intersectObjects(scene.children)

        intersects.forEach((intersect) => {
            if (intersect.object.name === "valid") {
                const highlighterPos = new Vector3().copy(intersect.point)
                highlighter.current.position.set(
                    highlighterPos.x,
                    groundY + boundBoxDimen[1] / 2,
                    highlighterPos.z
                )
            }
        })

        const objName = intersects[1].object.name
        const floorRegEx = new RegExp("^<floor>:[^ ]+$")
    }

    const furnitures = useState<{ name: string; mesh: Mesh }[]>([])

    return (
        <>
            <mesh
                position={[position.x, groundY + 0.05, position.y]}
                rotation={[-Math.PI / 2, 0, -angle]}
                name="valid"
                onPointerMove={handleOnMouseMove}
                receiveShadow
            >
                <planeGeometry
                    args={[
                        size[0] - boundBoxDimen[0],
                        size[1] - boundBoxDimen[2],
                    ]}
                />
                <meshStandardMaterial visible={true} color="green" />
            </mesh>

            <mesh ref={highlighter} rotation={[0, -angle, 0]}>
                <boxGeometry args={boundBoxDimen} />
                <meshStandardMaterial
                    roughness={0}
                    metalness={0.3}
                    color={COLOR_VALID}
                    opacity={0.4}
                    transparent
                />
            </mesh>
        </>
    )
}

export const Room = (props: RoomProps) => {
    const { positions, groundY, containerRef, boundBoxDimen, mode } = props

    const roots = {
        A: {
            x: positions[0],
            y: positions[2],
        },

        B: {
            x: positions[3],
            y: positions[5],
        },

        C: {
            x: positions[6],
            y: positions[8],
        },
    }

    const height = positions[13] - groundY
    const width = distance(roots.A, roots.B)
    const depth = distance(roots.B, roots.C)

    const position = {
        x: (roots.A.x + roots.C.x) / 2,
        y: (roots.A.y + roots.C.y) / 2,
    }

    const angle = radFromTwoPoints(roots.A, roots.B)

    return (
        <>
            <mesh
                receiveShadow
                position={[position.x, groundY + height / 2, position.y]}
                rotation={[0, -angle, 0]}
                onPointerEnter={(event) => event.stopPropagation()}
            >
                <Geometry>
                    <Base scale={1}>
                        <boxGeometry args={[width, height, depth]} />
                    </Base>

                    <Subtraction scale={0.99} position={[0, 0.015, 0]}>
                        <boxGeometry args={[width, height, depth]} />
                    </Subtraction>
                </Geometry>

                <meshStandardMaterial roughness={0} metalness={0.3} />
            </mesh>

            {/* {mode === ModeType.Bound && (
                <Ground
                    angle={angle}
                    position={position}
                    size={[width, depth]}
                    groundY={groundY}
                    containerRef={containerRef}
                    boundBoxDimen={boundBoxDimen}
                />
            )} */}

            <pointLight
                position={[position.x, groundY + height + 1, position.y]}
                intensity={50}
            />
        </>
    )
}

export const Scales = (props: {
    showScales: boolean
    positions: number[]
    groundY: number
}) => {
    const { showScales, positions, groundY } = props

    const roots = {
        A: {
            x: positions[0],
            y: positions[2],
        },

        B: {
            x: positions[3],
            y: positions[5],
        },

        C: {
            x: positions[6],
            y: positions[8],
        },
    }

    const height = positions[13] - groundY
    const width = distance(roots.A, roots.B)
    const depth = distance(roots.B, roots.C)

    const angle = radFromTwoPoints(roots.A, roots.B)

    const firstEdgeMeasurement = () => {
        const firstRootDs = normalizedD(roots.A, roots.B)
        const APerps = perpPoints(roots.A, firstRootDs.dx, firstRootDs.dy, 2)
        const BPerps = perpPoints(roots.B, firstRootDs.dx, firstRootDs.dy, 2)

        const AMax = findPointMaxDistance(APerps, roots.C)
        const BMax = findPointMaxDistance(BPerps, roots.C)

        const position = {
            x: (AMax.x + BMax.x) / 2,
            y: (AMax.y + BMax.y) / 2,
        }

        return { AMax, BMax, position }
    }

    const secondEdgeMeasurement = () => {
        const normDs = normalizedD(roots.B, roots.C)

        const CPerps = perpPoints(roots.C, normDs.dx, normDs.dy, 2)
        const BPerps = perpPoints(roots.B, normDs.dx, normDs.dy, 2)

        const CMax = findPointMaxDistance(CPerps, roots.A)
        const BMax = findPointMaxDistance(BPerps, roots.A)

        const position = {
            x: (CMax.x + BMax.x) / 2,
            y: (CMax.y + BMax.y) / 2,
        }

        return { CMax, BMax, position }
    }

    const _first = firstEdgeMeasurement()
    const _second = secondEdgeMeasurement()

    return (
        <group visible={showScales}>
            <mesh>
                <Line
                    points={[
                        new Vector3(_first.AMax.x, groundY, _first.AMax.y),
                        new Vector3(_first.BMax.x, groundY, _first.BMax.y),
                    ]}
                    lineWidth={5}
                />

                <Grid
                    position={[
                        (_first.AMax.x + roots.B.x) / 2,
                        groundY,
                        (_first.AMax.y + roots.B.y) / 2,
                    ]}
                    args={[width, 2]}
                    rotation={[0, -angle, 0]}
                    side={2}
                />

                <Billboard
                    position={[
                        _first.position.x,
                        groundY + 0.3,
                        _first.position.y,
                    ]}
                >
                    <Text scale={0.5} color={COLOR_TEXT}>{`${width.toFixed(
                        3
                    )} m`}</Text>
                </Billboard>
            </mesh>

            <mesh>
                <Line
                    points={[
                        new Vector3(_second.CMax.x, groundY, _second.CMax.y),
                        new Vector3(_second.BMax.x, groundY, _second.BMax.y),
                    ]}
                    lineWidth={5}
                />

                <Grid
                    position={[
                        (_second.BMax.x + roots.C.x) / 2,
                        groundY,
                        (_second.BMax.y + roots.C.y) / 2,
                    ]}
                    args={[2, depth]}
                    rotation={[0, -angle, 0]}
                    side={2}
                />

                <Billboard
                    position={[
                        _second.position.x,
                        groundY + 0.3,
                        _second.position.y,
                    ]}
                >
                    <Text scale={0.5} color={COLOR_TEXT}>{`${depth.toFixed(
                        3
                    )} m`}</Text>
                </Billboard>
            </mesh>

            <mesh>
                <Line
                    points={[
                        new Vector3(_second.BMax.x, groundY, _second.BMax.y),
                        new Vector3(
                            _second.BMax.x,
                            groundY + height,
                            _second.BMax.y
                        ),
                    ]}
                    lineWidth={5}
                />

                <Grid
                    position={[
                        (_second.BMax.x + roots.B.x) / 2,
                        groundY + height / 2,
                        (_second.BMax.y + roots.B.y) / 2,
                    ]}
                    args={[height, 2]}
                    rotation={[0, -angle + Math.PI / 2, Math.PI / 2]}
                    side={2}
                />

                <Billboard
                    position={[
                        _second.BMax.x,
                        groundY + height / 2,
                        _second.BMax.y - 1,
                    ]}
                >
                    <Text scale={0.5} color={COLOR_TEXT}>{`${height.toFixed(
                        3
                    )} m`}</Text>
                </Billboard>
            </mesh>
        </group>
    )
}
