export const distance = (
    pointA: { x: number; y: number },
    pointB: { x: number; y: number }
) => {
    const dx = pointA.x - pointB.x
    const dy = pointA.y - pointB.y
    return Math.sqrt(dx ** 2 + dy ** 2)
}

export const perpPoints = (
    rootPoint: { x: number; y: number },
    rootDx: number,
    rootDy: number,
    length: number
) => {
    const firstPoint = {
        x: rootPoint.x - length * rootDy,
        y: rootPoint.y + length * rootDx,
    }

    const secondPoint = {
        x: rootPoint.x + length * rootDy,
        y: rootPoint.y - length * rootDx,
    }

    return [firstPoint, secondPoint]
}

const dotProduct = (
    firstPoint: { x: number; y: number },
    secondPoint: { x: number; y: number }
) => {
    return firstPoint.x * secondPoint.x + firstPoint.y * secondPoint.y
}

const projection = (
    A: {
        x: number
        y: number
    },
    B: {
        x: number
        y: number
    },
    C: {
        x: number
        y: number
    }
) => {
    const ab = { x: B.x - A.x, y: B.y - A.y }
    const ac = { x: C.x - A.x, y: C.y - A.y }

    const slope =
        dotProduct({ x: ac.x, y: ac.y }, { x: ab.x, y: ab.y }) /
        dotProduct({ x: ab.x, y: ab.y }, { x: ab.x, y: ab.y })

    return { x: A.x + slope * ab.x, y: A.y + slope * ab.y }
}

export const findPointMinDistance = (
    points: { x: number; y: number }[],
    pointToCompare: { x: number; y: number }
) => {
    const distances = points.map((p) => {
        return distance(
            { x: p.x, y: p.y },
            { x: pointToCompare.x, y: pointToCompare.y }
        )
    })

    const idxOfMin = distances.indexOf(Math.min.apply(null, distances))

    return points[idxOfMin]
}

export const normalizedD = (
    A: { x: number; y: number },
    B: { x: number; y: number }
) => {
    const dx = A.x - B.x
    const dy = A.y - B.y
    const distAB = distance(A, B)
    return { dx: dx / distAB, dy: dy / distAB }
}

export const flatten = (points: { x: number; y: number; z: number }[]) => {
    return points
        .map((p) => {
            return [p.x, p.y, p.z]
        })
        .flat()
}

const distanceToLine = (
    line: {
        A: { x: number; y: number }
        B: { x: number; y: number }
    },
    point: { x: number; y: number }
) => {
    const proj = projection(line.A, line.B, point)
    return distance(point, proj)
}

export const projectToRoomEdge = (
    roomBottomRoots: { x: number; y: number; z: number }[],
    pointsToProject: { x: number; y: number; z: number }[]
) => {
    return pointsToProject.map((p) => {
        const distances = roomBottomRoots.map((r, ir) => {
            const A = { x: roomBottomRoots[ir].x, y: roomBottomRoots[ir].z }
            const B = {
                x: roomBottomRoots[(ir + 1) % roomBottomRoots.length].x,
                y: roomBottomRoots[(ir + 1) % roomBottomRoots.length].z,
            }

            return {
                A: A,
                B: B,
                dist: distanceToLine(
                    {
                        A: A,
                        B: B,
                    },
                    { x: p.x, y: p.z }
                ),
            }
        })

        const nearestEdge = distances.reduce((prev, curr) =>
            prev.dist < curr.dist ? prev : curr
        )

        return projection(nearestEdge.A, nearestEdge.B, { x: p.x, y: p.z })
    })
}

export const groupRoots = (
    flattenRoots: number[],
    rootsEachGroup: number = 4
) => {
    const arrayClone = flattenRoots
    const result = []
    while (arrayClone.length > 0)
        result.push(arrayClone.splice(0, rootsEachGroup * 3))
    return result
}

export const radFromTwoPoints = (
    A: { x: number; y: number },
    B: { x: number; y: number }
) => {
    const dx = A.x - B.x
    const dy = A.y - B.y
    return Math.atan2(dy, dx)
}
