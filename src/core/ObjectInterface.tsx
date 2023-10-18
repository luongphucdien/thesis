interface FPObject {
    position: [x: number, y: number, z: number]
    key: string
    name: string
}

export interface PointObject {
    x: number
    y: number
    z: number
    key: string
}

export interface FloorObject extends FPObject {
    width: number
    length: number
}

export interface FloorBufferObject extends Omit<FPObject, "position"> {
    points: PointObject[]
}

export interface ProjectObjects {
    name: string
    floors?: FloorObject[]
    floorBuffer?: FloorBufferObject
}
