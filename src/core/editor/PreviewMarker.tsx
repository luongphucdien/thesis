import { ModeType } from "./ModeType"

interface PreviewMarkerProps {
    mode: ModeType
}

export const PreviewMarker = (props: PreviewMarkerProps) => {
    const { mode } = props
    return (
        <>
            {(mode === ModeType.Move && <></>) ||
                (mode === ModeType.Floor && <FloorPreviewMarker />)}
        </>
    )
}

interface FloorPreviewMarkerProps {
    width: number
    length: number
}

const FloorPreviewMarker = () => {
    return (
        <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial />
        </mesh>
    )
}
