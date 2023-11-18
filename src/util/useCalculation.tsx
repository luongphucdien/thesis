import { Vector3 } from "three"
import { distance, radFromTwoPoints } from "../core/ARScene/geometryUtils"

export const useCalculation = (
    positions: number[],
    groundY: number,
    groundOffset: number
) => {
    const roots = {
        A: { x: positions[0], y: positions[2] },
        B: { x: positions[3], y: positions[5] },
    }

    const width = parseFloat(distance(roots.A, roots.B).toFixed(3))
    const height = positions[7] - groundY

    const angle = -parseFloat(radFromTwoPoints(roots.A, roots.B).toFixed(3))

    const position = new Vector3(
        (roots.A.x + roots.B.x) / 2,
        groundY + groundOffset + height / 2,
        (roots.A.y + roots.B.y) / 2
    )

    return { width, height, angle, position }
}
