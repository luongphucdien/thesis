import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useLocalStorage } from "@uidotdev/usehooks"
import React, { useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { IoMdArrowBack, IoMdSave } from "react-icons/io"
import { MdOutlineFileDownload } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"
import { Group, Mesh } from "three"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"
import { saveProject } from "../../api"
import { Button } from "../../components/button"
import { Modal } from "../../components/modal"
import { useDisclosure } from "../../util/useDisclosure"
import { useToggle } from "../../util/useToggle"
import { distance } from "../ARScene/geometryUtils"
import { FloorObject, ProjectObjects } from "../ObjectInterface"
import { GroundSurface } from "./GroundSurface"
import { ModeType } from "./ModeType"
import { Door, Window } from "./Openings"
import { Room, Scales } from "./Room"
import { SidePanel } from "./SidePanel"

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

    const sidePanelToggle = useToggle()

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

    const objectWidth = useRef<HTMLInputElement>(null!)
    const objectHeight = useRef<HTMLInputElement>(null!)
    const objectDepth = useRef<HTMLInputElement>(null!)
    const objectName = useRef<HTMLInputElement>(null!)

    const [objectBound, setObjectBound] = useState<{
        width: number
        height: number
        depth: number
        name: string
    }>({
        name: "",
        depth: 0,
        height: 0,
        width: 0,
    })

    const [groundIsShown, setGroundIsShown] = useState<boolean>(false)

    const handleAddObject = () => {
        const width = parseFloat(objectWidth.current.value)

        const height = parseFloat(objectHeight.current.value)

        const depth = parseFloat(objectDepth.current.value)

        const name = objectName.current.value

        if (width > 0 && height > 0 && depth > 0 && name.length > 0) {
            setGroundIsShown(true)

            setObjectBound({
                width: width,
                height: height,
                depth: depth,
                name: name,
            })
        } else {
            alert("All the fields must not be empty")
        }
    }

    const resetObject = () => {
        setObjectBound({
            width: 0,
            depth: 0,
            height: 0,
            name: "",
        })

        objectWidth.current.value = ""
        objectHeight.current.value = ""
        objectDepth.current.value = ""
        objectName.current.value = ""

        setGroundIsShown(false)
    }

    const addObjectDisclosure = useDisclosure()

    const handleGroundOnClick = () => {
        addObjectDisclosure.onOpen()
    }

    return (
        <div
            className="relative h-[100vh] w-[100vw] overflow-hidden"
            ref={containerRef}
        >
            <Modal
                isOpen={addObjectDisclosure.isOpen}
                onClose={addObjectDisclosure.onClose}
            >
                <div className="flex flex-col items-center gap-4">
                    <p className="text-xl font-medium">
                        Add {objectBound.name} here?
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="error"
                            onClick={() => addObjectDisclosure.onClose()}
                        >
                            No
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => {
                                setGroundIsShown(false)
                                addObjectDisclosure.onClose()
                            }}
                        >
                            Yes
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
                </IconContext.Provider>
            </div>

            <SidePanel
                state={sidePanelToggle.state}
                toggle={sidePanelToggle.toggle}
            >
                <div className="flex h-full flex-1 flex-col items-center gap-5 overflow-auto bg-indigo-500 p-4">
                    <p>{`${mode} Mode`}</p>

                    <div className="flex w-full flex-col gap-6">
                        <div className="flex gap-2">
                            <label htmlFor="show-scales">Show scales?</label>
                            <input
                                type="checkbox"
                                onChange={() => setShowScales(!showScales)}
                                id="show-scales"
                                checked={showScales}
                            />
                        </div>

                        <div className="flex flex-col items-center gap-4 rounded-xl border-4 border-indigo-400 p-2">
                            <p className="text-xl font-semibold">Add Object</p>

                            <table className="[&>tr:last-child>td]:pb-0 [&>tr>td:first-child]:pr-4 [&>tr>td>input]:w-full [&>tr>td>input]:text-neutral-800 [&>tr>td]:pb-2">
                                <tr>
                                    <td>Name</td>
                                    <td>
                                        <input type="text" ref={objectName} />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Width</td>
                                    <td>
                                        <input
                                            type="number"
                                            ref={objectWidth}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Height</td>
                                    <td>
                                        <input
                                            type="number"
                                            ref={objectHeight}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Depth</td>
                                    <td>
                                        <input
                                            type="number"
                                            ref={objectDepth}
                                        />
                                    </td>
                                </tr>
                            </table>

                            <Button
                                variant="non opaque"
                                onClick={handleAddObject}
                            >
                                Add
                            </Button>

                            <Button variant="non opaque" onClick={resetObject}>
                                Reset
                            </Button>
                        </div>

                        <Button onClick={handleExportRoom} variant="non opaque">
                            Export Room
                        </Button>
                    </div>
                </div>
            </SidePanel>

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

                {groundIsShown && (
                    <group>
                        <GroundSurface
                            roomPositions={roomPositions}
                            containerRef={containerRef}
                            groundY={1}
                            object={objectBound}
                            onClick={handleGroundOnClick}
                        />
                    </group>
                )}

                <OrbitControls />
                {/* <axesHelper args={[100]} position={[0, 1, 0]} /> */}

                <ambientLight intensity={1} color={"white"} />

                <Environment preset="apartment" blur={0.1} background />
            </Canvas>
        </div>
    )
}
