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

interface MarkerObj {
    position: THREE.Vector3
}

export const ARScene = () => {
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
    const [show, setShow] = useState<number>(0)

    const onSessionStart = (event: XREvent<XRManagerEvent>) => {
        markerArray.current = []
    }
    const onSessionEnd = () => {}

    return (
        <>
            <ARButton />

            <Canvas>
                <XR
                    referenceSpace="local"
                    onSessionStart={onSessionStart}
                    onSessionEnd={onSessionEnd}
                >
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Marker />
                    <Controllers />
                </XR>
            </Canvas>

            <button onClick={() => setShow(markerArray.current.length)}>
                Show
            </button>

            <div>
                {show &&
                    markerArray.current.map((item, idx) => (
                        <div key={idx} className="pb-4">
                            {item.position.toArray()}
                        </div>
                    ))}
            </div>
        </>
    )
}
