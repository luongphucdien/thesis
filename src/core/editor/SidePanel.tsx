import { IconContext } from "react-icons"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

interface SidePanelProps extends React.PropsWithChildren {
    toggle: () => void
    state: boolean
}

export const SidePanel = (props: SidePanelProps) => {
    const { state, toggle, children } = props

    // const handleObjectDelete = (objectKey: string) => {
    //     const objType = objectKey.split(":")[0]
    //     if (objType === "<floor>") {
    //         setFloorArray(floorArray.filter((f) => f.key !== objectKey))
    //     }
    //     setDirty(!dirty)
    // }

    // const [objNewName, setObjNewName] = useState("")
    // const handleNameChange = (objectKey: string, newName: string) => {
    //     const objType = objectKey.split(":")[0]
    //     if (objType === "<floor>") {
    //         const newFloorArray = floorArray.map((f) => {
    //             if (f.key === objectKey) {
    //                 return { ...f, name: `<floor>:${newName}` }
    //             } else {
    //                 return f
    //             }
    //         })
    //         setFloorArray(newFloorArray)
    //     }
    //     setDirty(!dirty)
    // }

    // const handleSetFloorDimension = () => {
    //     setFloorDimension({
    //         width: parseFloat(widthRef.current.value),
    //         length: parseFloat(lengthRef.current.value),
    //     })
    // }

    return (
        <div
            className={`pointer-events-auto absolute top-0 z-[999] flex h-full w-80 items-center text-neutral-100 ${
                state ? "right-0" : "-right-72"
            }`}
        >
            <span
                className=" cursor-pointer rounded-s-xl bg-indigo-500 py-5 text-neutral-100"
                onClick={toggle}
            >
                <IconContext.Provider value={{ size: "24px" }}>
                    {state ? <IoIosArrowForward /> : <IoIosArrowBack />}
                </IconContext.Provider>
            </span>

            {children}
        </div>
    )
}
