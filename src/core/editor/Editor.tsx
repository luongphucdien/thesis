import { MapControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useLocalStorage } from "@uidotdev/usehooks"
import React, { useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import {
    IoIosArrowBack,
    IoIosArrowForward,
    IoIosMove,
    IoMdArrowBack,
    IoMdClose,
    IoMdGrid,
    IoMdSave,
} from "react-icons/io"
import { MdOutlineFileDownload } from "react-icons/md"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Group, Mesh } from "three"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"
import { saveProject } from "../../api"
import { Button } from "../../components/button"
import { Modal } from "../../components/modal"
import { useDisclosure } from "../../util/useDisclosure"
import { distance } from "../ARScene/geometryUtils"
import { FloorObject, ProjectObjects } from "../ObjectInterface"
import { FurnitureType, ModeType } from "./ModeType"
import { Door, Window } from "./Openings"
import { Room, Scales } from "./Room"

const Indices = {
    SQUARE: [
        0, 1, 2, 3, 2, 1, 1, 0, 4, 4, 5, 1, 3, 1, 7, 5, 7, 1, 2, 3, 7, 7, 6, 2,
        0, 2, 6, 6, 4, 0,
    ],
    SQUARE2: [
        0, 1, 2, 2, 3, 0, 0, 4, 5, 5, 1, 0, 1, 5, 6, 6, 2, 1, 2, 6, 7, 7, 3, 2,
        3, 7, 4, 4, 0, 3,
    ],
    DOOR: [0, 1, 2, 2, 3, 0],
}

export const Editor = () => {
    const params = useParams()

    const [cookies] = useCookies(["userUID"])

    const containerRef = useRef<HTMLDivElement>(null)
    const highlighter = useRef<Mesh>(null!)

    const [objectFound, setObjectFound] = useState<boolean>(false)
    const [mode, setMode] = useState(ModeType.Default)

    const [projName, setProjName] = useState(params.name!)

    const widthRef = useRef<HTMLInputElement>(null!)
    const lengthRef = useRef<HTMLInputElement>(null!)
    const [floorDimension, setFloorDimension] = useState<{
        width: number
        length: number
    }>({ length: 1, width: 1 })

    const [floorArray, setFloorArray] = useState<FloorObject[]>([])

    const [roomPositions, setRoomPositions] = useState<number[]>([])
    const [doorPositions, setDoorPositions] = useState<number[][]>([])
    const [windowPositions, setWindowPositions] = useState<number[][]>([])

    const [dirty, setDirty] = useState(false)

    const [projects, _] = useLocalStorage<ProjectObjects[]>("projects", [
        {
            name: "",
        },
    ])

    useEffect(() => {
        projects.forEach((item) => {
            if (item.name === params.name) {
                setFloorArray(item.floors ? item.floors : [])
                setRoomPositions(item.room!.roomRoots)
                setDoorPositions(item.room!.doorRoots)
                setWindowPositions(item.room!.windowRoots)
            }
        })
        document.title = params.name!
    }, [])

    const sidePanelDisclosure = useDisclosure()

    const [showScales, setShowScales] = useState(true)

    const addFurniureDisclosure = useDisclosure()

    const [boundDimen, setBoundDimen] = useState<{
        width: number
        height: number
        depth: number
    }>({ width: 0, height: 0, depth: 0 })

    const roomRef = useRef<Group>(null!)

    const exportRoomDisclosure = useDisclosure()

    const roomAsJSON = useRef<string>("")

    const SidePanel = () => {
        const handleTrigger = () => {
            sidePanelDisclosure.isOpen
                ? sidePanelDisclosure.onClose()
                : sidePanelDisclosure.onOpen()
        }

        const handleObjectDelete = (objectKey: string) => {
            const objType = objectKey.split(":")[0]
            if (objType === "<floor>") {
                setFloorArray(floorArray.filter((f) => f.key !== objectKey))
            }
            setDirty(!dirty)
        }

        const [objNewName, setObjNewName] = useState("")
        const handleNameChange = (objectKey: string, newName: string) => {
            const objType = objectKey.split(":")[0]
            if (objType === "<floor>") {
                const newFloorArray = floorArray.map((f) => {
                    if (f.key === objectKey) {
                        return { ...f, name: `<floor>:${newName}` }
                    } else {
                        return f
                    }
                })
                setFloorArray(newFloorArray)
            }
            setDirty(!dirty)
        }

        const handleSetFloorDimension = () => {
            setFloorDimension({
                width: parseFloat(widthRef.current.value),
                length: parseFloat(lengthRef.current.value),
            })
        }

        const handleExportRoom = () => {
            const exporter = new GLTFExporter()
            exporter.parse(
                roomRef.current,
                (room) => {
                    exportRoomDisclosure.onOpen()
                    roomAsJSON.current = JSON.stringify(room)
                },
                (error) => {
                    console.log("Error", error)
                },
                {}
            )
        }

        return (
            <div
                className={`pointer-events-auto absolute top-0 z-[999] flex h-full w-80 items-center text-neutral-100 ${
                    sidePanelDisclosure.isOpen ? "right-0" : "-right-72"
                }`}
            >
                <span
                    className=" cursor-pointer rounded-s-xl bg-indigo-500 py-5 text-neutral-100"
                    onClick={handleTrigger}
                >
                    <IconContext.Provider value={{ size: "24px" }}>
                        {sidePanelDisclosure.isOpen ? (
                            <IoIosArrowForward />
                        ) : (
                            <IoIosArrowBack />
                        )}
                    </IconContext.Provider>
                </span>

                <div className="flex h-full flex-1 flex-col items-center gap-5 overflow-auto bg-indigo-500 p-4">
                    <p>{`${mode} Mode`}</p>

                    <div className="flex w-full flex-col gap-4">
                        <div className="flex gap-2">
                            <label htmlFor="show-scales">Show scales?</label>
                            <input
                                type="checkbox"
                                onChange={() => setShowScales(!showScales)}
                                id="show-scales"
                                checked={showScales}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <select className="h-10 w-full rounded-lg px-4 text-neutral-800">
                                <option value={FurnitureType.Table}>
                                    Table
                                </option>
                            </select>

                            <Button
                                onClick={addFurniureDisclosure.onOpen}
                                variant="non opaque"
                            >
                                Add Furniture
                            </Button>
                        </div>

                        <Button onClick={handleExportRoom} variant="non opaque">
                            Export Room
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const ModeButton = ({
        children,
        modeType,
    }: React.PropsWithChildren<{ modeType: ModeType }>) => {
        return (
            <span
                className={`cursor-pointer rounded-md p-1 ${
                    modeType === mode ? "bg-indigo-800" : ""
                }`}
                onClick={() => setMode(modeType)}
                title={modeType}
            >
                {children}
            </span>
        )
    }

    const handleOnSaveSuccess = () => {
        alert("Save successfully!")
        nav(-1)
    }
    const handleOnSaveFailure = () => {
        alert("Save failed")
    }

    const handleSave = () => {
        const thisProject: ProjectObjects = {
            name: projName,
            floors: floorArray,
        }
        saveProject(
            cookies.userUID,
            thisProject,
            projName,
            handleOnSaveSuccess,
            handleOnSaveFailure
        )
    }

    const modes = [
        <span
            key={"mode-save"}
            onClick={handleSave}
            className={"cursor-pointer rounded-md p-1"}
            title="Save"
        >
            <IoMdSave />
        </span>,

        <ModeButton key={"mode-move"} modeType={ModeType.Default}>
            <IoIosMove />
        </ModeButton>,

        <ModeButton key={"mode-floor"} modeType={ModeType.Floor}>
            <IoMdGrid />
        </ModeButton>,

        <ModeButton key={"mode-ar"} modeType={ModeType.AR}>
            <Link to={"/ar"}>
                <TbAugmentedReality />
            </Link>
        </ModeButton>,
    ]

    const nav = useNavigate()

    const handleAddBoundBox = () => {
        setMode(ModeType.Bound)
        addFurniureDisclosure.onClose()
    }

    const roomWidth = parseFloat(
        distance(
            { x: roomPositions[0], y: roomPositions[2] },
            { x: roomPositions[3], y: roomPositions[5] }
        ).toFixed(3)
    )

    const roomDepth = parseFloat(
        distance(
            { x: roomPositions[6], y: roomPositions[8] },
            { x: roomPositions[3], y: roomPositions[5] }
        ).toFixed(3)
    )

    const roomHeight = parseFloat(Math.abs(roomPositions[13] - 1).toFixed(3))

    return (
        <div
            className="relative h-[100vh] w-[100vw] overflow-hidden"
            ref={containerRef}
        >
            <Modal
                isOpen={addFurniureDisclosure.isOpen}
                onClose={addFurniureDisclosure.onClose}
            >
                <div className="relative h-full w-full">
                    <span
                        className="absolute -right-4 -top-4 rounded-full p-1 transition-all hover:bg-neutral-300 active:bg-neutral-400"
                        onClick={addFurniureDisclosure.onClose}
                    >
                        <IconContext.Provider value={{ size: "24px" }}>
                            <IoMdClose />
                        </IconContext.Provider>
                    </span>

                    <div className="flex flex-col gap-4 pt-3 ">
                        <p className="text-center text-xl font-medium">
                            Set Bounding Box Dimension
                        </p>

                        <div className="rounded-xl bg-indigo-600 p-4 text-neutral-100 [&>table>tr:last-child>td]:pb-0 [&>table>tr>td:first-child]:pr-4 [&>table>tr>td>input]:pl-2 [&>table>tr>td>input]:text-neutral-800 [&>table>tr>td]:pb-2">
                            <table>
                                <tr>
                                    <td>Width</td>
                                    <td>
                                        <input
                                            value={boundDimen.width}
                                            onChange={(e) =>
                                                setBoundDimen({
                                                    ...boundDimen,
                                                    width: parseFloat(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            onBlur={(e) => {
                                                setBoundDimen({
                                                    ...boundDimen,
                                                    width: Math.min(
                                                        roomWidth,
                                                        Math.max(
                                                            0,
                                                            parseFloat(
                                                                e.target.value
                                                            )
                                                        )
                                                    ),
                                                })
                                            }}
                                            type="number"
                                        />
                                    </td>
                                    <td>m</td>
                                </tr>

                                <tr>
                                    <td>Depth</td>
                                    <td>
                                        <input
                                            value={boundDimen.depth}
                                            onChange={(e) =>
                                                setBoundDimen({
                                                    ...boundDimen,
                                                    depth: parseFloat(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            onBlur={(e) => {
                                                setBoundDimen({
                                                    ...boundDimen,
                                                    depth: Math.min(
                                                        roomDepth,
                                                        Math.max(
                                                            0,
                                                            parseFloat(
                                                                e.target.value
                                                            )
                                                        )
                                                    ),
                                                })
                                            }}
                                            type="number"
                                        />
                                    </td>
                                    <td>m</td>
                                </tr>

                                <tr>
                                    <td>Height</td>
                                    <td>
                                        <input
                                            value={boundDimen.height}
                                            onChange={(e) =>
                                                setBoundDimen({
                                                    ...boundDimen,
                                                    height: parseFloat(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            onBlur={(e) => {
                                                setBoundDimen({
                                                    ...boundDimen,
                                                    height: Math.min(
                                                        roomHeight,
                                                        Math.max(
                                                            0,
                                                            parseFloat(
                                                                e.target.value
                                                            )
                                                        )
                                                    ),
                                                })
                                            }}
                                            type="number"
                                        />
                                    </td>
                                    <td>m</td>
                                </tr>
                            </table>
                        </div>

                        <Button
                            disabled={
                                boundDimen.depth <= 0 ||
                                boundDimen.height <= 0 ||
                                boundDimen.width <= 0
                            }
                            onClick={handleAddBoundBox}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={exportRoomDisclosure.isOpen}
                onClose={exportRoomDisclosure.onClose}
            >
                <div>
                    <a
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            roomAsJSON.current
                        )}`}
                        download={`${projName}.gltf`}
                        className="inline-flex flex-col items-center"
                    >
                        <span>
                            <IconContext.Provider value={{ size: "48px" }}>
                                <MdOutlineFileDownload />
                            </IconContext.Provider>
                        </span>
                        Download as GLTF
                    </a>
                </div>
            </Modal>

            <div className="fixed left-0 top-0 z-[999] flex h-12 w-full items-center gap-5 bg-indigo-600 px-2 text-neutral-100">
                <IconContext.Provider value={{ size: "20px" }}>
                    <span
                        onClick={() => nav(-1)}
                        className="cursor-pointer"
                        title="Go back"
                    >
                        <IoMdArrowBack />
                    </span>

                    <div>
                        <input
                            placeholder="Project Name"
                            className="px-2 text-neutral-800"
                            onChange={(e) => setProjName(e.target.value)}
                            defaultValue={params.name}
                        />
                    </div>

                    <div className="h-full w-0.5 bg-neutral-100" />

                    {modes.map((item) => (
                        <>{item}</>
                    ))}
                </IconContext.Provider>
            </div>

            <SidePanel />

            <Canvas camera={{ position: [3, 7, 3] }} shadows>
                <mesh visible={dirty} position={[1000, 1000, 1000]}>
                    <boxGeometry />
                </mesh>

                <group ref={roomRef}>
                    <Room
                        positions={roomPositions}
                        groundY={1}
                        containerRef={containerRef}
                        showScales={showScales}
                        boundBoxDimen={[
                            boundDimen.width,
                            boundDimen.height,
                            boundDimen.depth,
                        ]}
                        mode={mode}
                    />

                    {doorPositions !== undefined &&
                        doorPositions.map((d, i) => (
                            <Door positions={d} groundY={1} key={`door-${i}`} />
                        ))}

                    {windowPositions !== undefined &&
                        windowPositions.map((w, i) => (
                            <Window
                                positions={w}
                                groundY={1}
                                key={`window-${i}`}
                            />
                        ))}
                </group>

                <group>
                    <Scales
                        groundY={1}
                        positions={roomPositions}
                        showScales={showScales}
                    />
                </group>

                <MapControls />
                <axesHelper args={[100]} position={[0, 1, 0]} />

                <ambientLight intensity={1} color={"white"} />
            </Canvas>
        </div>
    )
}
