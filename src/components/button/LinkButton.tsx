import { NavLink } from "react-router-dom"
import { ButtonProps } from "./Button"

interface LinkButtonProps extends ButtonProps {
    to: string
}

export const LinkButton = (props: LinkButtonProps) => {
    const { children, to } = props
    return (
        <NavLink
            to={to}
            className="button inline-flex items-center justify-center text-center"
        >
            {children}
        </NavLink>
    )
}
