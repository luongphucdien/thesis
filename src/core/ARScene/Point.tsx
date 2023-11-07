import { Vector3 } from "three"
import { PointObject } from "../ObjectInterface"

const PointColor = {
    ROOM: "#60a5fa",
    DOOR: "#f472b6",
    WINDOW: "#fb7185",
}

export const Point = (props: PointObject) => {
    const { x, y, z, type } = props
    return (
        <mesh position={new Vector3(x, y, z)}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial
                color={
                    type === "room"
                        ? PointColor.ROOM
                        : type === "door"
                        ? PointColor.DOOR
                        : type === "window"
                        ? PointColor.WINDOW
                        : ""
                }
            />
        </mesh>
    )
}
