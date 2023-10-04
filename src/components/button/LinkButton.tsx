import { NavLink } from "react-router-dom"
import { ButtonProps } from "./Button"

interface LinkButtonProps extends ButtonProps {
    to: string
    variant?: "primary" | "error" | "non opaque"
}

export const LinkButton = (props: LinkButtonProps) => {
    const { children, to, variant = "primary" } = props

    const _style =
        variant === "primary"
            ? "button-primary"
            : variant === "error"
            ? "button-error"
            : variant === "non opaque"
            ? "button-non--opaque"
            : ""

    return (
        <NavLink
            to={to}
            className={`${_style} inline-flex items-center justify-center text-center`}
        >
            {children}
        </NavLink>
    )
}
