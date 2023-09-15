import { Canvas } from "@react-three/fiber"
import {
    ARButton,
    Controllers,
    Interactive,
    XR,
    XREvent,
    XRManagerEvent,
    useHitTest,
} from "@react-three/xr"
import { useRef, useState } from "react"
import { IconContext } from "react-icons"
import { FaChevronLeft } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/button"
import { CoordinateTable } from "../../components/coordinate-table"

interface MarkerObj {
    position: THREE.Vector3
}

export const ARScene = () => {
    const [isARMode, setIsARMode] = useState(false)

    const markerRef = useRef<THREE.Mesh>(null!)
    const [markerColor, setMarkerColor] = useState<any>("blue")

    const Marker = () => {
        useHitTest((hitMatrix: THREE.Matrix4) => {
            hitMatrix.decompose(
                markerRef.current.position,
                markerRef.current.quaternion,
                markerRef.current.scale
            )
        })

        const handleOnSelect = () => {
            setMarkerColor((Math.random() * 0xffffff) | 0)
            markerArray.current.push({ position: markerRef.current.position })
        }

        return (
            <Interactive onSelect={handleOnSelect}>
                <mesh ref={markerRef} receiveShadow castShadow>
                    <boxGeometry args={[0.1, 0.1, 0.1]} />
                    <meshStandardMaterial color={markerColor} />
                </mesh>
            </Interactive>
        )
    }

    const markerArray = useRef<MarkerObj[]>([])
    const [show, setShow] = useState(false)

    const onSessionStart = (event: XREvent<XRManagerEvent>) => {
        markerArray.current = []
        setIsARMode(true)
        setShow(false)
    }
    const onSessionEnd = () => {
        setIsARMode(false)
        setShow(true)
    }

    const navigate = useNavigate()

    return (
        <div
            className={`flex h-full flex-col items-center gap-8 ${
                !isARMode ? "bg-gray-600 text-neutral-100" : ""
            }`}
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
                    <p>End</p>
                </div>
            )}

            {!isARMode && (
                <div className="flex h-full flex-col items-center justify-center gap-10 p-4">
                    {show ? (
                        <>
                            <p className="text-xl font-semibold">
                                Markers&apos; Results
                            </p>

                            {markerArray.current.length ? (
                                <>
                                    <CoordinateTable>
                                        {markerArray.current.map(
                                            (item, idx) => (
                                                <CoordinateTable.Row
                                                    key={`row-${idx}`}
                                                >
                                                    <CoordinateTable.Column>
                                                        Marker {idx + 1}
                                                    </CoordinateTable.Column>

                                                    <CoordinateTable.Column>
                                                        {item.position.x.toFixed(
                                                            3
                                                        )}
                                                    </CoordinateTable.Column>

                                                    <CoordinateTable.Column>
                                                        {item.position.y.toFixed(
                                                            3
                                                        )}
                                                    </CoordinateTable.Column>

                                                    <CoordinateTable.Column>
                                                        {item.position.z.toFixed(
                                                            3
                                                        )}
                                                    </CoordinateTable.Column>
                                                </CoordinateTable.Row>
                                            )
                                        )}
                                    </CoordinateTable>

                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-center text-xs">
                                            Happy with the result? If not, you
                                            can try again!
                                        </p>

                                        <div className="flex gap-4">
                                            <Button>No</Button>
                                            <Button>Yes!</Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <p>Hmm, there are no markers here.</p>
                                    <p>
                                        Please try to scan again and remember to
                                        tap the marker at the right position!
                                    </p>
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
                </div>
            )}

            <ARButton />

            <div className="h-full w-full">
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
                                <Marker />
                                <Controllers />
                            </>
                        )}
                    </XR>
                </Canvas>
            </div>
        </div>
    )
}
