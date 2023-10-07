import { MapControls } from "@react-three/drei"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import { IconContext } from "react-icons"
import {
    IoIosArrowBack,
    IoIosArrowForward,
    IoIosMove,
    IoMdArrowBack,
    IoMdClose,
    IoMdPin,
} from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { Mesh, Raycaster, Vector2, Vector3 } from "three"
import { useDisclosure } from "../../util/useDisclosure"

enum ObjectType {
    Default = 0,
    Marker = 1,
}

const Modes = ["Move", "Add Marker"]

export const Editor = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const highlighter = useRef<Mesh>(null!)
    const marker = useRef<Mesh>(null!)

    const [objectFound, setObjectFound] = useState<boolean>(false)
    const [objectSelector, setObjectSelector] = useState(ObjectType.Default)

    const [markers, setMarkers] = useState<Mesh[]>([])

    const [thisObj, setThisObj] = useState<{ objName: string }>({
        objName: "",
    })

    const CustomGrid = () => {
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
                if (intersect.object.name === "ground") {
                    const highlighterPos = new Vector3().copy(intersect.point)
                    highlighter.current.position.set(
                        highlighterPos.x,
                        0.02,
                        highlighterPos.z
                    )
                }
            })

            const objName = intersects[1].object.name
            const markerRegEx = new RegExp("^marker-[0-9]$")

            setObjectFound(markerRegEx.test(objName))
        }

        const handleOnMouseClick = () => {
            const markerClone = marker.current.clone()
            markerClone.position.copy(highlighter.current.position)
            markerClone.position.setY(0.01)
            markerClone.visible = true

            markerClone.name = `marker-${markers.length}`

            setMarkers((markers) => [...markers, markerClone])
            scene.add(markerClone)
        }

        return (
            <mesh
                rotation={[Math.PI * -0.5, 0, 0]}
                onPointerMove={handleOnMouseMove}
                onPointerDown={
                    objectSelector !== ObjectType.Default
                        ? handleOnMouseClick
                        : () => null
                }
            >
                <planeGeometry args={[20, 20]} />
                <meshBasicMaterial color={"rgb(156,163,175)"} />
            </mesh>
        )
    }

    const sidePanelDisclosure = useDisclosure()

    const SidePanel = () => {
        const handleTrigger = () => {
            sidePanelDisclosure.isOpen
                ? sidePanelDisclosure.onClose()
                : sidePanelDisclosure.onOpen()
        }

        const handleDeleteObject = (object: Mesh) => {
            const markerRegEx = new RegExp("^marker-[0-9]$")
            if (markerRegEx.test(object.name)) {
                setMarkers(markers.filter((obj) => obj.name !== object.name))
            }
        }

        return (
            <div
                className={`pointer-events-auto absolute right-0 top-0 z-[999] flex h-full w-80 items-center text-neutral-100 ${
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

                <div className="flex h-full flex-1 flex-col items-center gap-5 bg-indigo-500 p-4">
                    <p>{`${
                        objectSelector === ObjectType.Default
                            ? "Free Cam"
                            : objectSelector === ObjectType.Marker
                            ? "Marker"
                            : ""
                    } Mode`}</p>

                    <div className="flex w-full flex-col gap-2">
                        {markers.map((item) => (
                            <div
                                key={item.name}
                                className="flex justify-between rounded-md border border-neutral-100 p-2"
                            >
                                <p>{item.name}</p>

                                <IconContext.Provider value={{ size: "24px" }}>
                                    <div>
                                        <span
                                            className="cursor-pointer"
                                            title="Delete this object"
                                            onClick={() =>
                                                handleDeleteObject(item)
                                            }
                                        >
                                            <IoMdClose />
                                        </span>
                                    </div>
                                </IconContext.Provider>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const ToolBar = () => {
        const ModeButton = ({
            children,
            mode,
        }: React.PropsWithChildren<{ mode: ObjectType }>) => {
            return (
                <span
                    className={`cursor-pointer rounded-md p-1 ${
                        objectSelector === mode ? "bg-indigo-800" : ""
                    }`}
                    onClick={() => setObjectSelector(mode)}
                    title={Modes[mode]}
                >
                    {children}
                </span>
            )
        }

        const modes = [
            <ModeButton key={"mode-move"} mode={ObjectType.Default}>
                <IoIosMove />
            </ModeButton>,

            <ModeButton key={"mode-marker"} mode={ObjectType.Marker}>
                <IoMdPin />
            </ModeButton>,
        ]

        const nav = useNavigate()

        return (
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
                            className="text-neutral-800"
                        />
                    </div>

                    <div className="h-full w-0.5 bg-neutral-100" />

                    {modes.map((item) => (
                        <>{item}</>
                    ))}
                </IconContext.Provider>
            </div>
        )
    }

    return (
        <div
            className="relative h-[100vh] w-[100vw] overflow-hidden"
            ref={containerRef}
        >
            <ToolBar />
            <SidePanel />

            <Canvas camera={{ position: [0, 10, 0] }}>
                <mesh rotation={[Math.PI * -0.5, 0, 0]} name="ground">
                    <planeGeometry args={[20, 20]} />
                    <meshBasicMaterial visible={false} />
                </mesh>

                <mesh
                    position={[0.5, 0.01, 0.5]}
                    rotation={[Math.PI * -0.5, 0, 0]}
                    ref={highlighter}
                >
                    <planeGeometry />
                    <meshBasicMaterial
                        color={"green"}
                        visible={objectFound ? false : true}
                    />
                </mesh>

                <group>
                    <mesh
                        rotation={[Math.PI * -0.5, 0, 0]}
                        position={[1000, 1000, 1000]}
                        visible={false}
                        ref={marker}
                    >
                        <planeGeometry />
                        <meshBasicMaterial color={"blue"} />
                    </mesh>
                </group>

                <MapControls />
                <CustomGrid />
            </Canvas>
        </div>
    )
}
