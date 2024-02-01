import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useLocalStorage } from "@uidotdev/usehooks"
import { Suspense, useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { IoMdArrowBack } from "react-icons/io"
import { MdCheck, MdClose, MdOutlineFileDownload } from "react-icons/md"
import { useNavigate, useParams } from "react-router-dom"
import { Group, Vector3 } from "three"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import {
    fetchCustomModel,
    fetchProjects,
    listCustomModels,
    saveCustomModels,
    saveCustomObjects,
} from "../../api"
import { Button, IconButton } from "../../components/button"
import { ModelLibrary } from "../../components/composites/model-library"
import { SubPanel } from "../../components/composites/sub-panel"
import { Modal } from "../../components/modal"
import { Slot } from "../../components/slot"
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
    const [objectRotation, setObjectRotation] = useState("0")

    const [objectBound, setObjectBound] = useState<{
        width: number
        height: number
        depth: number
        name: string
        rotation: number
    }>({
        name: "",
        depth: 0,
        height: 0,
        width: 0,
        rotation: 0,
    })

    const [groundIsShown, setGroundIsShown] = useState<boolean>(false)

    const handleAddObject = () => {
        const width = parseFloat(objectWidth.current.value)

        const height = parseFloat(objectHeight.current.value)

        const depth = parseFloat(objectDepth.current.value)

        const name = objectName.current.value

        const rotation = (parseInt(objectRotation) * Math.PI) / 180

        if (width > 0 && height > 0 && depth > 0 && name.length > 0) {
            setGroundIsShown(true)

            setObjectBound({
                width: width,
                height: height,
                depth: depth,
                name: name,
                rotation: rotation,
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
            rotation: 0,
        })

        objectWidth.current.value = ""
        objectHeight.current.value = ""
        objectDepth.current.value = ""
        objectName.current.value = ""
        setObjectRotation("0")

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
                rotation: objectBound.rotation,
                color: "",
            },
        ])
    }

    const handleSaveCustomObjects = async () => {
        await saveCustomObjects(projName, cookies.userUID, objList)
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
        rotation: 0,
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

    const modelLibDisclosure = useDisclosure()

    const [customModels, setCustomModels] = useLocalStorage("customModels", [
        "",
    ])

    const handleRefreshModelList = () => {
        listCustomModels(cookies.userUID, (files) => {
            setCustomModels(files)
        })
    }

    const handleCustomModelOnClick = (modelName: string) => {
        fetchCustomModel(cookies.userUID, modelName)
    }

    const addCustomModelSubPanelDisc = useDisclosure()

    const [model, setModel] = useState<{
        name: string
        mesh: Group | undefined
    }>({
        mesh: undefined,
        name: "",
    })

    const localModelInputRef = useRef<HTMLInputElement>(null!)
    const handleAddLocalModel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawFile = e.target.files ? e.target.files[0] : null
        const reader = new FileReader()
        reader.addEventListener("load", (e) => {
            const content = e.target?.result

            const loader = new GLTFLoader()
            loader.parse(content!, "", (gltf) =>
                setModel({
                    name: rawFile ? rawFile.name : "",
                    mesh: gltf.scene,
                })
            )
        })
        reader.readAsArrayBuffer(rawFile!)

        e.target.files && addCustomModelSubPanelDisc.onOpen()
    }

    const [customObjectsList, setCustomObjectsList] = useState<
        { name: string; mesh: Group; position: Vector3; rotation: number }[]
    >([])

    const [tempVal, setTempVal] = useState<{
        pos: Vector3 | null
        angle: number
    }>({
        angle: 0,
        pos: null,
    })

    const [customModelRotation, setCustomModelRotation] = useState(0)

    const handleResetCustomModel = () => {
        addCustomModelSubPanelDisc.onClose()
        setModel({
            name: "",
            mesh: undefined,
        })

        setTempVal({
            angle: 0,
            pos: null,
        })
        setCustomModelRotation(0)
    }

    const placeCustomModelDisclosure = useDisclosure()

    const handleGroundClickCustomModel = (pos: Vector3, angle: number) => {
        placeCustomModelDisclosure.onOpen()
        setTempVal({ pos: pos, angle: angle })
    }

    const handlePlaceCustomModel = () => {
        console.log(model.mesh)
        setCustomObjectsList([
            ...customObjectsList,
            {
                name: model.name,
                mesh: model.mesh!,
                position: tempVal.pos!,
                rotation: (customModelRotation * Math.PI) / 180,
            },
        ])
        placeCustomModelDisclosure.onClose()
        handleResetCustomModel()
    }

    // HTTP 413: Payload too large for current implementation ----------- //
    const handleSaveCustomModels = async () => {
        await saveCustomModels(cookies.userUID, projName, customObjectsList)
    }
    // ------------------------------------------------------------------ //

    const handleSave = () => {
        handleSaveCustomObjects().then(() => {
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

    const saveDialogueDisc = useDisclosure()

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

            <Modal
                isOpen={placeCustomModelDisclosure.isOpen}
                onClose={placeCustomModelDisclosure.onClose}
            >
                <p>Place {model.name} here?</p>

                <div className="flex gap-4">
                    <Button
                        variant="error"
                        onClick={placeCustomModelDisclosure.onClose}
                    >
                        No
                    </Button>

                    <Button onClick={handlePlaceCustomModel}>Yes</Button>
                </div>
            </Modal>

            <Modal
                isOpen={saveDialogueDisc.isOpen}
                onClose={saveDialogueDisc.onClose}
            >
                <div className="flex flex-col gap-8 py-4">
                    <div className="flex flex-col gap-2 text-center text-xl">
                        <p className="font-medium">
                            Warning: Custom models imported cannot be saved with
                            project currently.
                        </p>

                        <p>
                            Any imported models in this project will be lost
                            after saving.
                        </p>

                        <p>
                            It is advisable to export the project and save it
                            locally first to avoid losing any possible changes.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex w-fit flex-col gap-2">
                            <Button
                                variant="error"
                                onClick={saveDialogueDisc.onClose}
                            >
                                Let me export it first
                            </Button>

                            <Button onClick={handleSave}>
                                I understand, please save the project
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <ModelLibrary
                isOpen={modelLibDisclosure.isOpen}
                onClose={modelLibDisclosure.onClose}
                onRefresh={handleRefreshModelList}
            >
                {customModels.map((model) => (
                    <Slot
                        key={`model-${model.split(".")[0]}`}
                        onClick={() => handleCustomModelOnClick(model)}
                    >
                        <div className="flex h-full w-full items-center justify-center rounded-2xl border border-neutral-500">
                            <p>{model}</p>
                        </div>
                    </Slot>
                ))}
            </ModelLibrary>

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

                                <p>
                                    Rotation:{" "}
                                    {(selectedObject.rotation * 180) / Math.PI}
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

                <SubPanel isOpen={addCustomModelSubPanelDisc.isOpen}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <p>Model: {model.name}</p>

                            <p>Angle: {customModelRotation}</p>

                            <div className="flex gap-2">
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    onChange={(e) =>
                                        setCustomModelRotation(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    value={customModelRotation}
                                />

                                <IconButton>
                                    <MdCheck />
                                </IconButton>
                            </div>
                        </div>

                        <div>
                            <Button
                                variant="error"
                                onClick={handleResetCustomModel}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </SubPanel>

                <div className="flex h-full flex-1 flex-col items-center gap-5 overflow-auto bg-indigo-500 p-4">
                    <div className="flex h-full w-full flex-col gap-6">
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

                            <div>
                                <p>Rotation: {objectRotation}</p>
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    onChange={(e) =>
                                        setObjectRotation(e.target.value)
                                    }
                                />
                            </div>

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

                        <div className="flex flex-1 flex-col gap-4">
                            <Button
                                variant="non opaque"
                                onClick={modelLibDisclosure.onOpen}
                            >
                                Your Model Library
                            </Button>

                            <Button
                                variant="non opaque"
                                onClick={() =>
                                    localModelInputRef.current.click()
                                }
                            >
                                Add Local Model
                            </Button>

                            <input
                                type="file"
                                ref={localModelInputRef}
                                className="hidden"
                                onChange={handleAddLocalModel}
                                accept=".glb"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                onClick={handleExportRoom}
                                variant="non opaque"
                            >
                                Export Room
                            </Button>

                            <Button
                                variant="non opaque"
                                onClick={saveDialogueDisc.onOpen}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </SidePanel>

            <Suspense
                fallback={
                    <div className="z-[999] flex h-full w-full items-center justify-center text-4xl">
                        Loading
                    </div>
                }
            >
                <Canvas camera={{ position: [3, 7, 3] }} shadows>
                    <mesh visible={dirty} position={[1000, 1000, 1000]}>
                        <boxGeometry />
                    </mesh>

                    <group ref={roomRef}>
                        <Room positions={roomPositions} groundY={1} />

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
                                        rotation={obj.rotation}
                                    />
                                )
                            )}

                        {customObjectsList !== undefined &&
                            customObjectsList.map((cObj, idx) => (
                                <mesh
                                    key={`${cObj.name}-${idx}`}
                                    name={cObj.name}
                                    position={cObj.position}
                                    rotation={[
                                        0,
                                        tempVal.angle + cObj.rotation,
                                        0,
                                    ]}
                                >
                                    <primitive object={cObj.mesh} />
                                </mesh>
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

                    {/* {model.mesh && <primitive object={model.mesh} />} */}

                    {model.mesh && (
                        <GroundSurface
                            roomPositions={roomPositions}
                            containerRef={containerRef}
                            groundY={1}
                            object={{
                                depth: 0,
                                height: 0,
                                width: 0,
                                rotation: (customModelRotation * Math.PI) / 180,
                                name: model.name,
                            }}
                            onClick={handleGroundClickCustomModel}
                            customModel={model.mesh}
                        />
                    )}

                    <OrbitControls />

                    <ambientLight intensity={1} color={"white"} />

                    <Environment preset="apartment" blur={0.1} background />
                </Canvas>
            </Suspense>
        </div>
    )
}
