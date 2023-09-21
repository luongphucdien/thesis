import { ButtonProps } from "./Button"

interface IconButtonProps extends ButtonProps {}

export const IconButton = (props: IconButtonProps) => {
    const { children } = props
    return (
        <button {...props} className="icon-button">
            {children}
        </button>
    )
}
