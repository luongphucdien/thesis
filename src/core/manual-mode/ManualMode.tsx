import { MapControls } from "@react-three/drei"
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import { IconContext } from "react-icons"
import { IoIosArrowBack } from "react-icons/io"
import {
    BufferGeometry,
    Material,
    Mesh,
    NormalBufferAttributes,
    Object3DEventMap,
    Raycaster,
    Vector2,
    Vector3,
} from "three"
import { Button } from "../../components/button"
import { useDisclosure } from "../../util/useDisclosure"

enum ObjectType {
    Default = 0,
    Marker = 1,
}

export const ManualMode = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const highlighter = useRef<Mesh>(null!)
    const marker = useRef<Mesh>(null!)

    const [objectFound, setObjectFound] = useState(false)
    const [objectSelector, setObjectSelector] = useState(ObjectType.Default)

    const CustomGrid = () => {
        const { camera, scene } = useThree()

        const mousePos = new Vector2()
        const raycaster = new Raycaster()

        const [_thisMarker, setThisMarker] = useState<Mesh>()

        const handleOnMouseMove = (event: ThreeEvent<PointerEvent>) => {
            mousePos.x = containerRef.current
                ? (((event.clientX / window.innerWidth) * 2 - 1) * 100) / 70
                : 0

            mousePos.y = containerRef.current
                ? ((-(event.clientY / window.innerHeight) * 2 + 1) * 100) / 70
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

            const markerRegEx = new RegExp("^marker-[0-9]$")

            setObjectFound(markerRegEx.test(intersects[1].object.name))
        }

        const markers: Mesh<
            BufferGeometry<NormalBufferAttributes>,
            Material | Material[],
            Object3DEventMap
        >[] = []

        const handleOnMouseClick = () => {
            const markerClone = marker.current.clone()
            markerClone.position.copy(highlighter.current.position)
            markerClone.position.setY(0.01)
            markerClone.visible = true
            markerClone.name = `marker-${markers.length}`

            markers.push(markerClone)
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

        const Modes = () => {
            return (
                <div className="flex flex-col gap-4">
                    <Button
                        onClick={() => setObjectSelector(ObjectType.Marker)}
                        variant="non opaque"
                    >
                        Add Marker
                    </Button>

                    <Button
                        onClick={() => setObjectSelector(ObjectType.Default)}
                        variant="non opaque"
                    >
                        Free Camera Mode
                    </Button>
                </div>
            )
        }

        return (
            <div
                className={`pointer-events-auto absolute right-0 top-0 z-[999] flex h-full w-72 items-center text-neutral-100 ${
                    sidePanelDisclosure.isOpen ? "right-0" : "-right-64"
                }`}
            >
                <span
                    className=" cursor-pointer rounded-s-xl bg-indigo-600 py-5 text-neutral-100"
                    onClick={handleTrigger}
                >
                    <IconContext.Provider value={{ size: "24px" }}>
                        <IoIosArrowBack />
                    </IconContext.Provider>
                </span>

                <div className="flex h-full flex-1 flex-col bg-indigo-600 p-4">
                    {objectSelector}
                    <Modes />
                </div>
            </div>
        )
    }

    const handleMouseOverObject = (e: ThreeEvent<PointerEvent>) => {
        console.log(e.eventObject)
    }

    return (
        <div
            className="relative h-[70vh] w-[70vw] overflow-hidden"
            ref={containerRef}
        >
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
                        onPointerMove={handleMouseOverObject}
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
