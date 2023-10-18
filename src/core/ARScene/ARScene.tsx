import { Canvas } from "@react-three/fiber"
import { ARButton, Controllers, XR, useHitTest } from "@react-three/xr"
import { useRef, useState } from "react"
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

export const ARScene = () => {
    const [cookies] = useCookies(["userUID"])
    const [projName, setProjName] = useState("")

    const [isARMode, setIsARMode] = useState(false)

    const pointPreviewRef = useRef<THREE.Mesh>(null!)

    const [pointArray, setPointArray] = useState<PointObject[]>([])
    const [positions, setPositions] = useState<number[][]>([[]])

    const [dirty, setDirty] = useState(false)

    const [sessionEnd, setSessionEnd] = useState(false)

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
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial />
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
        const floorUUID = generateUUID()
        const thisProjObjects: ProjectObjects = {
            name: projName,
            floorBuffer: {
                key: `<floor>-${floorUUID}`,
                name: `<floor>-${floorUUID.split("-")[0]}`,
                points: pointArray,
                positions: positions.flat(),
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
        const uuid = generateUUID()

        const pos = {
            x: parseFloat(pointPreviewRef.current.position.x.toFixed(3)),
            y: parseFloat(pointPreviewRef.current.position.y.toFixed(3)),
            z: parseFloat(pointPreviewRef.current.position.z.toFixed(3)),
        }

        setPointArray([
            ...pointArray,
            {
                x: pos.x,
                y: pos.y,
                z: pos.z,
                key: `<point>-${uuid}`,
            },
        ])

        setPositions([...positions, [pos.x, 0.05, pos.z]])
        setDirty(!dirty)
    }

    const handleRemovePoint = () => {
        setPointArray(pointArray.slice(0, -1))
        setDirty(!dirty)
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

                            {pointArray.length ? (
                                <>
                                    <CoordinateTable>
                                        {pointArray.map((item, idx) => (
                                            <CoordinateTable.Row
                                                key={`row-${idx}`}
                                            >
                                                <CoordinateTable.Column>
                                                    Point {idx + 1}
                                                </CoordinateTable.Column>

                                                <CoordinateTable.Column>
                                                    {item.x}
                                                </CoordinateTable.Column>

                                                <CoordinateTable.Column>
                                                    {item.y}
                                                </CoordinateTable.Column>

                                                <CoordinateTable.Column>
                                                    {item.z}
                                                </CoordinateTable.Column>
                                            </CoordinateTable.Row>
                                        ))}
                                    </CoordinateTable>

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

                    <p className="text-center italic sm:hidden">
                        Editor is currently unavailable for mobile, please
                        access it from your PC or from a device with larger
                        screen.
                    </p>
                </div>
            )}

            {!sessionEnd && <ARButton />}

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
