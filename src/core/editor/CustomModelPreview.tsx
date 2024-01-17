import { useThree } from "@react-three/fiber"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OBJLoader } from "three/addons/loaders/OBJLoader.js"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"

interface CustomModelPreviewProps {
    rawFile: File
}

export const CustomModelPreview = (props: CustomModelPreviewProps) => {
    const { rawFile } = props

    const { scene } = useThree()

    const modelType = rawFile.name.split(".")[1]

    const reader = new FileReader()

    reader.addEventListener("load", (e) => {
        const content = e.target?.result

        const fbxLoader = new FBXLoader()
        const gltfLoader = new GLTFLoader()
        const objLoader = new OBJLoader()

        if (modelType === "gltf" || modelType === "glb") {
            gltfLoader.parse(content!, "", (gltf) => scene.add(gltf.scene))
        } else if (modelType === "fbx") {
            const fbx = fbxLoader.parse(content!, "")
            scene.add(fbx)
        } else if (modelType === "obj") {
            const obj = objLoader.parse(content! as string)
            scene.add(obj)
        }
    })

    reader.readAsArrayBuffer(rawFile)

    // console.log(url)

    // const model =
    //     modelType === "gltf"
    //         ? useGLTF(url)
    //         : modelType === "fbx"
    //         ? useFBX(url)
    //         : null

    return (
        // <mesh>
        //     <boxGeometry />
        //     <meshStandardMaterial />
        // </mesh>
        <></>
    )
}
