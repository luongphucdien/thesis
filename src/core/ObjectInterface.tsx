import { Vector3 } from "three"

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
    type: "room" | "door" | "window" | "unknown"
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
    roomRoots: number[]
    doorRoots: number[][]
    windowRoots: number[][]
}

export interface CustomObject {
    name: string
    dimension: [width: number, height: number, depth: number]
    position: Vector3
    angle: number
}

export interface ProjectObjects {
    name: string
    floors?: FloorObject[]
    floorBuffer?: FloorBufferObject
    room?: RoomObject
    objects?: CustomObject[]
}
