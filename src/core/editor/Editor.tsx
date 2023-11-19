import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { IoMdArrowBack } from "react-icons/io"
import { MdClose, MdOutlineFileDownload } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"
import { Group, Vector3 } from "three"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"
import { fetchProjects, saveCustomObjects } from "../../api"
import { Button } from "../../components/button"
import { Modal } from "../../components/modal"
import { useDisclosure } from "../../util/useDisclosure"
import { useToggle } from "../../util/useToggle"
import { CustomObject, ProjectObjects } from "../ObjectInterface"
import { GroundSurface } from "./GroundSurface"
import { SelfDefinedObject } from "./Object"
import { Door, Window } from "./Openings"
import { Room, Scales } from "./Room"
import { SidePanel } from "./SidePanel"

export const Editor = () => {
    const params = useParams()

    const [cookies] = useCookies(["userUID"])

    const containerRef = useRef<HTMLDivElement>(null)

    const [projName, setProjName] = useState(params.name!)

    const [roomPositions, setRoomPositions] = useState<number[]>([])

    const [objList, setObjList] = useState<CustomObject[]>([])

    const [dirty, setDirty] = useState(false)

    const [projects, setProjects] = useLocalStorage<ProjectObjects[]>(
        "projects",
        [
            {
                name: "",
            },
        ]
    )

    useEffect(() => {
        projects.forEach((item) => {
            if (item.name === params.name) {
                setRoomPositions(item.room!.roomRoots)
                // setDoorPositions(item.room!.doorRoots)
                // setWindowPositions(item.room!.windowRoots)
                setObjList(item.room!.objects || [])

                console.log(item.room?.objects)
            }
        })
        document.title = params.name!
    }, [])

    const sidePanelToggle = useToggle()

    const [showScales, setShowScales] = useState(true)

    const roomRef = useRef<Group>(null!)

    const exportRoomDisclosure = useDisclosure()

    const roomAsJSON = useRef<string>("")

    const nav = useNavigate()

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

    const [objMeta, setObjMeta] = useState<{
        position: Vector3
        angle: number
    }>({ angle: 0, position: new Vector3() })

    const handleGroundOnClick = (objPos: Vector3, angle: number) => {
        addObjectDisclosure.onOpen()
        setObjMeta({ position: objPos, angle: angle })
    }

    const placeObject = () => {
        resetObject()
        addObjectDisclosure.onClose()

        setObjList([
            ...objList,
            {
                name: objectBound.name,
                dimension: [
                    objectBound.width,
                    objectBound.height,
                    objectBound.depth,
                ],
                position: objMeta.position,
                angle: objMeta.angle,
                color: "",
            },
        ])
    }

    const handleSaveCustomObjects = () => {
        saveCustomObjects(projName, cookies.userUID, objList).then(() => {
            alert("Save successfully!")
            fetchProjects(
                cookies.userUID,
                (proj: object) => {
                    setProjects(proj ? Object.values(proj) : [])
                },
                () => {}
            ).then(() => nav(0))
        })
    }

    const handleDeleteObject = (objName: string) => {
        setObjList(objList.filter((o) => o.name !== objName))
    }

    const infoPanelDisclosure = useDisclosure()
    const infoPanelRef = useRef<HTMLDivElement>(null!)
    const [selectedObject, setSelectedObject] = useState<CustomObject>({
        angle: 0,
        color: "",
        dimension: [0, 0, 0],
        name: "",
        position: new Vector3(),
    })

    const handleSelectObject = (obj: CustomObject) => {
        setSelectedObject(obj)
        infoPanelDisclosure.onOpen()
    }

    const [newColor, setNewColor] = useState("")

    const handleChangeColor = (objName: string) => {
        const newObjList = objList.map((o) => {
            if (o.name === objName) return { ...o, color: newColor }
            else return o
        })

        setObjList(newObjList)
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
                        Add &quot;{objectBound.name}&quot; here?
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="error"
                            onClick={() => addObjectDisclosure.onClose()}
                        >
                            No
                        </Button>

                        <Button variant="primary" onClick={placeObject}>
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
                {infoPanelDisclosure.isOpen && (
                    <div className="absolute right-96 top-20 rounded-xl bg-indigo-500 p-4">
                        <div className="relative">
                            <span
                                className="absolute right-0 top-0 rounded-full p-1 text-neutral-100 transition-all hover:bg-indigo-700 active:bg-indigo-800"
                                onClick={infoPanelDisclosure.onClose}
                            >
                                <IconContext.Provider value={{ size: "24px" }}>
                                    <MdClose />
                                </IconContext.Provider>
                            </span>

                            <div
                                className="flex flex-col gap-2 text-neutral-100"
                                ref={infoPanelRef}
                            >
                                <p className="whitespace-nowrap">
                                    Type:{" "}
                                    {selectedObject.name.includes("door")
                                        ? "Door"
                                        : selectedObject.name.includes("window")
                                        ? "Window"
                                        : "Object"}
                                </p>

                                <p>Name: {selectedObject.name}</p>

                                <div className="whitespace-nowrap">
                                    <p>Dimension</p>
                                    <p>Width: {selectedObject.dimension[0]}m</p>
                                    <p>
                                        Height: {selectedObject.dimension[1]}m
                                    </p>
                                    <p>Depth: {selectedObject.dimension[2]}m</p>
                                </div>

                                <p className="whitespace-nowrap">
                                    Position:{" "}
                                    {`[${selectedObject.position.x.toFixed(
                                        3
                                    )}, ${selectedObject.position.y.toFixed(
                                        3
                                    )}, ${selectedObject.position.z.toFixed(
                                        3
                                    )}]`}
                                </p>

                                <div className="flex flex-col items-center gap-4 whitespace-nowrap rounded-xl border-2 border-indigo-300 p-4">
                                    <p className="text-lg font-semibold">
                                        Color:
                                    </p>

                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            defaultValue={selectedObject.color}
                                            onChange={(e) =>
                                                setNewColor(e.target.value)
                                            }
                                        />
                                        <p>
                                            {newColor || selectedObject.color}
                                        </p>
                                    </div>

                                    <Button
                                        variant="non opaque"
                                        onClick={() =>
                                            handleChangeColor(
                                                selectedObject.name
                                            )
                                        }
                                    >
                                        Change color
                                    </Button>
                                </div>

                                <Button
                                    variant="non opaque"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            infoPanelRef.current.innerText.replace(
                                                /Copy|Delete|Change color/g,
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
                                    onClick={() =>
                                        handleDeleteObject(selectedObject.name)
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex h-full flex-1 flex-col items-center gap-5 overflow-auto bg-indigo-500 p-4">
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

                        <Button
                            variant="non opaque"
                            onClick={handleSaveCustomObjects}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </SidePanel>

            <Canvas camera={{ position: [3, 7, 3] }} shadows>
                <mesh visible={dirty} position={[1000, 1000, 1000]}>
                    <boxGeometry />
                </mesh>

                <group ref={roomRef}>
                    <Room positions={roomPositions} groundY={1} />

                    {/* {doorPositions !== undefined &&
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
                        ))} */}

                    {objList !== undefined &&
                        objList.map((obj) =>
                            obj.name.includes("door") ? (
                                <Door
                                    angle={obj.angle}
                                    dimension={[
                                        obj.dimension[0],
                                        obj.dimension[1],
                                    ]}
                                    position={obj.position}
                                    key={obj.name}
                                    name={obj.name}
                                    color={obj.color}
                                    onClick={handleSelectObject}
                                />
                            ) : obj.name.includes("window") ? (
                                <Window
                                    angle={obj.angle}
                                    dimension={[
                                        obj.dimension[0],
                                        obj.dimension[1],
                                    ]}
                                    position={obj.position}
                                    key={obj.name}
                                    name={obj.name}
                                    color={obj.color}
                                    onClick={handleSelectObject}
                                />
                            ) : (
                                <SelfDefinedObject
                                    angle={obj.angle}
                                    name={obj.name}
                                    position={
                                        new Vector3(
                                            obj.position.x,
                                            obj.position.y,
                                            obj.position.z
                                        )
                                    }
                                    key={`obj-${obj.name}`}
                                    dimension={obj.dimension}
                                    color={obj.color}
                                    onClick={handleSelectObject}
                                />
                            )
                        )}
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
