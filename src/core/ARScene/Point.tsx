import { Vector3 } from "three"
import { PointObject } from "../ObjectInterface"

export const Point = (props: PointObject) => {
    const { x, y, z } = props
    return (
        <mesh position={new Vector3(x, y, z)}>
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial color={"red"} />
        </mesh>
    )
}
