import { IconContext } from "react-icons"
import { MdClose, MdOutlineRefresh } from "react-icons/md"
import { Modal } from "../../modal"

interface ModelLibraryProps extends React.PropsWithChildren {
    isOpen: boolean
    onClose: () => void
    onRefresh: () => void
}

export const ModelLibrary = (props: ModelLibraryProps) => {
    const { isOpen, onClose, children, onRefresh } = props
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className=" overflow-hidden">
                <div className="relative mb-4">
                    <span
                        className="absolute right-0 top-0 rounded-full p-2 transition-all hover:bg-neutral-700/20 active:bg-neutral-700/30"
                        onClick={onClose}
                    >
                        <IconContext.Provider value={{ size: "24px" }}>
                            <MdClose />
                        </IconContext.Provider>
                    </span>

                    <span
                        className="absolute left-0 top-0 rounded-full p-2 transition-all hover:bg-neutral-700/20 active:bg-neutral-700/30"
                        title="Refresh"
                        onClick={onRefresh}
                    >
                        <IconContext.Provider value={{ size: "24px" }}>
                            <MdOutlineRefresh />
                        </IconContext.Provider>
                    </span>

                    <p className="text-center text-2xl">Model Library</p>
                </div>

                <div className="h-[80vh] w-[60vw] overflow-auto sm:h-[50vh] sm:w-[50vw] ">
                    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
                        {children}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
