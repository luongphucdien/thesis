import { Canvas } from "@react-three/fiber"
import { ARButton, Controllers, XR, useHitTest } from "@react-three/xr"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { FaChevronLeft } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { generateUUID } from "three/src/math/MathUtils.js"
import { saveProject } from "../../api"
import { Button } from "../../components/button"
import { CoordinateTable } from "../../components/coordinate-table"
import { TextField } from "../../components/text-field"
import { PointObject, ProjectObjects } from "../ObjectInterface"
import { Point } from "./Point"
import {
    distance,
    findPointMinDistance,
    flatten,
    groupRoots,
    normalizedD,
    perpPoints,
    projectToRoomEdge,
} from "./geometryUtils"

enum RoomAttributes {
    dimension,
    door,
    window,
}

export const ARScene = () => {
    const [cookies] = useCookies(["userUID"])
    const [projName, setProjName] = useState("<DEBUGGING2>")

    const [isARMode, setIsARMode] = useState(false)

    const pointPreviewRef = useRef<THREE.Mesh>(null!)

    const [pointArray, setPointArray] = useState<PointObject[]>([])
    const [roomPositions, setRoomPositions] = useState<number[][]>([[]])
    const [localRoomPos, setLocalRoomPos] = useLocalStorage("roomPositions", [
        [0],
    ])
    const [localDoorPos, setLocalDoorPos] = useLocalStorage("doorPositions", [
        [0],
    ])
    const [localWindowPos, setLocalWindowPos] = useLocalStorage(
        "windowPositions",
        [[0]]
    )

    const [roomAttribute, setRoomAttribute] = useState<RoomAttributes>(
        RoomAttributes.dimension
    )

    const [dirty, setDirty] = useState(false)

    const [sessionEnd, setSessionEnd] = useState(false)

    useEffect(() => {
        setLocalRoomPos([])
        setLocalDoorPos([])
        setLocalWindowPos([])
    }, [])

    const MarkerPreview = () => {
        useHitTest((hitMatrix: THREE.Matrix4) => {
            hitMatrix.decompose(
                pointPreviewRef.current.position,
                pointPreviewRef.current.quaternion,
                pointPreviewRef.current.scale
            )
        })

        return (
            <mesh ref={pointPreviewRef} receiveShadow castShadow>
                <mesh position={[0, 0.25, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                    <meshStandardMaterial color={"green"} opacity={0.01} />
                </mesh>
            </mesh>
        )
    }

    const [show, setShow] = useState(false)

    const onSessionStart = () => {
        setIsARMode(true)
        setShow(false)
    }

    const onSessionEnd = () => {
        setIsARMode(false)
        setShow(true)
        setSessionEnd(true)
    }

    const navigate = useNavigate()

    const handleSave = () => {
        const tempRoomRoots = localRoomPos.map((p) => {
            return { x: p[0], y: 1, z: p[2] }
        })

        const A = tempRoomRoots[0]
        const B = tempRoomRoots[1]
        const innerPoint = tempRoomRoots[2]

        const roomHeight = parseFloat(
            Math.abs(
                localRoomPos[localRoomPos.length - 2][1] -
                    localRoomPos[localRoomPos.length - 1][1]
            ).toFixed(3)
        )

        const roomLength = parseFloat(
            distance(
                { x: B.x, y: B.z },
                { x: innerPoint.x, y: innerPoint.z }
            ).toFixed(3)
        )

        tempRoomRoots.splice(2)

        const normD = normalizedD({ x: A.x, y: A.z }, { x: B.x, y: B.z })

        const perpPointsA = perpPoints(
            { x: A.x, y: A.z },
            normD.dx,
            normD.dy,
            roomLength
        )

        const perpPointsB = perpPoints(
            { x: B.x, y: B.z },
            normD.dx,
            normD.dy,
            roomLength
        )

        const D = findPointMinDistance(perpPointsA, {
            x: innerPoint.x,
            y: innerPoint.z,
        })

        const C = findPointMinDistance(perpPointsB, {
            x: innerPoint.x,
            y: innerPoint.z,
        })

        tempRoomRoots.push({ x: C.x, y: 1, z: C.y }, { x: D.x, y: 1, z: D.y })

        const roofPoints = tempRoomRoots.map((p) => {
            return { x: p.x, y: p.y + roomHeight, z: p.z }
        })

        tempRoomRoots.push(...roofPoints)

        // ============================ //

        const tempDoorRoots = localDoorPos.map((d, i) => {
            if (i % 4 < 2) return { x: d[0], y: 1, z: d[2] }
            else return
        })

        const filteredDoorRoots = tempDoorRoots.filter((item) => {
            return item !== undefined
        })

        const doorHeights = localDoorPos.map((d, i) => {
            if (i % 4 === 2) {
                return parseFloat(
                    Math.abs(
                        localDoorPos[i][1] - localDoorPos[i - 1][1]
                    ).toFixed(3)
                )
            }
        })

        const filteredDoorHeight = doorHeights.filter((i) => {
            return i !== undefined
        })

        const fixedDoorRoots = projectToRoomEdge(
            tempRoomRoots.slice(0, 4),
            filteredDoorRoots as { x: number; y: number; z: number }[]
        )

        tempDoorRoots.splice(0)

        filteredDoorHeight.forEach((dh, ih) => {
            tempDoorRoots.push(
                {
                    x: fixedDoorRoots[2 * ih + 0].x,
                    y: 1,
                    z: fixedDoorRoots[2 * ih + 0].y,
                },
                {
                    x: fixedDoorRoots[2 * ih + 1].x,
                    y: 1,
                    z: fixedDoorRoots[2 * ih + 1].y,
                },
                {
                    x: fixedDoorRoots[2 * ih + 1].x,
                    y: 1 + (dh as number),
                    z: fixedDoorRoots[2 * ih + 1].y,
                },
                {
                    x: fixedDoorRoots[2 * ih + 0].x,
                    y: 1 + (dh as number),
                    z: fixedDoorRoots[2 * ih + 0].y,
                }
            )
        })

        const flattenDoorRoots = flatten(
            tempDoorRoots as { x: number; y: number; z: number }[]
        )

        // =============================== //

        const thisProjObjects: ProjectObjects = {
            name: projName,
            room: {
                roomRoots: flatten(tempRoomRoots),
                doorRoots: groupRoots(flattenDoorRoots),
            },
        }

        saveProject(
            cookies.userUID,
            thisProjObjects,
            projName,
            handleSaveSuccess,
            handleSaveFail
        )
    }
    const handleSaveSuccess = () => {
        alert("Save successfully!")
        navigate(-1)
    }
    const handleSaveFail = () => {
        alert("Save failed!")
        navigate(0)
    }

    const handleAddPoint = () => {
        const pos = {
            x: parseFloat(pointPreviewRef.current.position.x.toFixed(3)),
            y: parseFloat(pointPreviewRef.current.position.y.toFixed(3)),
            z: parseFloat(pointPreviewRef.current.position.z.toFixed(3)),
        }

        const uuid = generateUUID()

        setPointArray([
            ...pointArray,
            {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                key: `<point>-${uuid}`,
            },
        ])

        if (roomAttribute === RoomAttributes.dimension) {
            setLocalRoomPos([
                ...localRoomPos,
                [pos.x, parseFloat((pos.y + 1.0).toFixed(3)), pos.z],
            ])
        } else if (roomAttribute === RoomAttributes.door) {
            setLocalDoorPos([
                ...localDoorPos,
                [pos.x, parseFloat((pos.y + 1.0).toFixed(3)), pos.z],
            ])
        } else if (roomAttribute === RoomAttributes.window) {
            setLocalWindowPos([
                ...localWindowPos,
                [pos.x, parseFloat((pos.y + 1.0).toFixed(3)), pos.z],
            ])
        }

        setDirty(!dirty)
    }

    const handleRemovePoint = () => {
        setPointArray(pointArray.slice(0, -1))
        setDirty(!dirty)
    }

    // --- FOR DEBUGGING ON PC ONLY --- //
    const handleAddPointPC = () => {
        setLocalRoomPos([
            [0, 2, 5],
            [-1, 2, 0],
            [1.2, 2, 2.2],
            [2.1, 2, 1.9],
            [0, 5, 5],
        ])

        setLocalDoorPos([
            [-0.8, 2, 1],
            [-0.5, 2, 2],
            [-0.8, 4, 1],
            [-0.5, 4, 2],
        ])

        // add windowPos
    }

    return (
        <div
            className={
                "flex h-full flex-col items-center gap-8 text-neutral-800"
            }
        >
            {!isARMode && (
                <div className="flex w-full justify-between p-4">
                    <IconContext.Provider value={{ size: "24px" }}>
                        <a
                            onClick={() => navigate(-1)}
                            className="cursor-pointer"
                        >
                            <FaChevronLeft />
                        </a>
                    </IconContext.Provider>
                </div>
            )}

            {!isARMode && (
                <div className="flex h-full flex-col items-center justify-center gap-10 p-4">
                    {show ? (
                        <>
                            <p className="text-xl font-semibold">
                                Markers&apos; Results
                            </p>

                            {localRoomPos ? (
                                <>
                                    <p>Room positions</p>
                                    <CoordinateTable>
                                        {localRoomPos.map((item, idx) => (
                                            <CoordinateTable.Row
                                                key={`row-${idx}`}
                                            >
                                                <CoordinateTable.Column>
                                                    Point {idx + 1}
                                                </CoordinateTable.Column>

                                                <CoordinateTable.Column>
                                                    {item[0]}
                                                </CoordinateTable.Column>

                                                <CoordinateTable.Column>
                                                    {item[1]}
                                                </CoordinateTable.Column>

                                                <CoordinateTable.Column>
                                                    {item[2]}
                                                </CoordinateTable.Column>
                                            </CoordinateTable.Row>
                                        ))}
                                    </CoordinateTable>

                                    {localDoorPos.length > 0 && (
                                        <>
                                            <p>Door positions</p>
                                            <CoordinateTable>
                                                {localDoorPos.map((d, i) => (
                                                    <CoordinateTable.Row
                                                        key={`door-row-${i}`}
                                                    >
                                                        <CoordinateTable.Column>
                                                            Position {i}
                                                        </CoordinateTable.Column>

                                                        <CoordinateTable.Column>
                                                            {d[0]}
                                                        </CoordinateTable.Column>

                                                        <CoordinateTable.Column>
                                                            {d[1]}
                                                        </CoordinateTable.Column>

                                                        <CoordinateTable.Column>
                                                            {d[2]}
                                                        </CoordinateTable.Column>
                                                    </CoordinateTable.Row>
                                                ))}
                                            </CoordinateTable>
                                        </>
                                    )}

                                    {localWindowPos.length > 0 && (
                                        <>
                                            <p>Window positions</p>
                                            <CoordinateTable>
                                                {localWindowPos.map((d, i) => (
                                                    <CoordinateTable.Row
                                                        key={`door-row-${i}`}
                                                    >
                                                        <CoordinateTable.Column>
                                                            Position {i}
                                                        </CoordinateTable.Column>

                                                        <CoordinateTable.Column>
                                                            {d[0]}
                                                        </CoordinateTable.Column>

                                                        <CoordinateTable.Column>
                                                            {d[1]}
                                                        </CoordinateTable.Column>

                                                        <CoordinateTable.Column>
                                                            {d[2]}
                                                        </CoordinateTable.Column>
                                                    </CoordinateTable.Row>
                                                ))}
                                            </CoordinateTable>
                                        </>
                                    )}

                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-center text-xs">
                                            Happy with the result? If not, you
                                            can try again!
                                        </p>

                                        <span className="[&>*]:text-neutral-800">
                                            <TextField
                                                onChange={(event) =>
                                                    setProjName(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Project Name"
                                            />
                                        </span>

                                        <div className="flex gap-4">
                                            <Button onClick={() => navigate(0)}>
                                                No
                                            </Button>

                                            <Button
                                                onClick={handleSave}
                                                disabled={projName === ""}
                                            >
                                                Yes!
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <p>Hmm, there are no markers here.</p>
                                    <p>
                                        Please try to scan again and remember to
                                        tap the marker at the right position!
                                    </p>
                                    <div>
                                        <Button onClick={() => navigate(0)}>
                                            Try again
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-semibold">
                                Seems like there&apos;s nothing here yet :&#40;
                            </p>
                        </>
                    )}

                    {/* <p className="text-center italic sm:hidden">
                        Editor is currently unavailable for mobile, please
                        access it from your PC or from a device with larger
                        screen.
                    </p> */}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="room-attr" className="text-base">
                            Select room attribute
                        </label>

                        <select
                            id="room-attr"
                            className="rounded-lg bg-indigo-600 p-2 text-neutral-100 transition-all hover:bg-indigo-500"
                            onChange={(e) => {
                                setRoomAttribute(
                                    parseInt(e.target.value) as RoomAttributes
                                )
                            }}
                        >
                            <option value={RoomAttributes.dimension}>
                                Room Dimension
                            </option>

                            <option value={RoomAttributes.door}>Door</option>

                            <option value={RoomAttributes.window}>
                                Window
                            </option>
                        </select>

                        <p>FOR DEBUGGING ONLY</p>
                        <Button onClick={handleAddPointPC}>
                            Populate room roots
                        </Button>

                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            )}

            <ARButton />

            <div className="h-full w-full">
                {isARMode && (
                    <span className="absolute bottom-20 z-[999] flex h-14 w-full flex-row-reverse gap-4 px-4">
                        <Button variant="primary" onClick={handleAddPoint}>
                            Add
                        </Button>

                        <Button variant="error" onClick={handleRemovePoint}>
                            Remove
                        </Button>
                    </span>
                )}

                <Canvas>
                    <XR
                        referenceSpace="local"
                        onSessionStart={onSessionStart}
                        onSessionEnd={onSessionEnd}
                    >
                        {isARMode && (
                            <>
                                <ambientLight />
                                <pointLight position={[10, 10, 10]} />
                                <MarkerPreview />
                                <Controllers />

                                <mesh
                                    position={[1000, 1000, 1000]}
                                    visible={dirty}
                                >
                                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                                </mesh>

                                {pointArray.map((p) => (
                                    <Point
                                        key={p.key}
                                        x={p.x}
                                        y={p.y}
                                        z={p.z}
                                    />
                                ))}
                            </>
                        )}
                    </XR>
                </Canvas>
            </div>
        </div>
    )
}
