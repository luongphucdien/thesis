import { useDisclosure } from "./useDisclosure"

export const useToggle = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()

    const toggle = () => {
        isOpen ? onClose() : onOpen()
    }
    const state = isOpen

    return { state, toggle }
}
