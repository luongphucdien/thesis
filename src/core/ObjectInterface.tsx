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
    positions: number[]
}

interface OnWallObject {
    positions: number[]
    width?: number
    height?: number
}

export interface DoorObject extends OnWallObject {}
export interface WindowObject extends OnWallObject {}

interface RoomObject {
    positions: number[]
    firstEdge?: number
    secondEdge?: number
    height?: number
    doors?: DoorObject[]
    windows?: WindowObject[]
}

export interface ProjectObjects {
    name: string
    floors?: FloorObject[]
    floorBuffer?: FloorBufferObject
    room?: RoomObject
}
