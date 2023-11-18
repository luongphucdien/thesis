import { Billboard, Html } from "@react-three/drei"
import { IconContext } from "react-icons"
import { MdClose } from "react-icons/md"

interface InfoBoardProps extends React.PropsWithChildren {
    onClose: () => void
    position: [x: number, y: number, z: number]
}

export const InfoBoard = (props: InfoBoardProps) => {
    const { children, onClose, position } = props
    return (
        <Billboard position={position}>
            <Html>
                <div className="relative rounded-xl bg-indigo-600 p-4">
                    <span
                        className="absolute right-2 top-2 rounded-full p-1 text-neutral-100 transition-all hover:bg-indigo-700 active:bg-indigo-800"
                        onClick={onClose}
                    >
                        <IconContext.Provider value={{ size: "24px" }}>
                            <MdClose />
                        </IconContext.Provider>
                    </span>
                    {children}
                </div>
            </Html>
        </Billboard>
    )
}
