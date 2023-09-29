import { useEffect } from "react"

interface ModalProps extends React.PropsWithChildren {
    isOpen: boolean
    onClose: () => void
}

export const Modal = (props: ModalProps) => {
    const { isOpen, onClose, children } = props
    useEffect(() => {
        isOpen
            ? document.body.classList.add("modal-shown")
            : document.body.classList.remove("modal-shown")
    }, [isOpen])

    return (
        <>
            <div
                className={`modal-backdrop ${isOpen ? "" : "hidden"}`}
                onClick={onClose}
            />
            <div className={`modal-main ${isOpen ? "" : "hidden"}`}>
                <div className="modal-content">{children}</div>
            </div>
        </>
    )
}
