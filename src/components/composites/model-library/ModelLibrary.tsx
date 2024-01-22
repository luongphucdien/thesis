import { IconContext } from "react-icons"
import { MdClose } from "react-icons/md"
import { Modal } from "../../modal"

interface ModelLibraryProps extends React.PropsWithChildren {
    isOpen: boolean
    onClose: () => void
}

export const ModelLibrary = (props: ModelLibraryProps) => {
    const { isOpen, onClose, children } = props
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
                    <p className="text-center text-2xl">Model Library</p>
                </div>

                <div className="grid h-[80vh] w-[60vw] grid-cols-2 gap-2 overflow-auto sm:h-[50vh] sm:w-[50vw] sm:grid-cols-4">
                    {children}
                </div>
            </div>
        </Modal>
    )
}
