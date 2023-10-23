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

export const projection = (
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
