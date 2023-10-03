export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "error" | "non opaque"
}

export const Button = (props: ButtonProps) => {
    const { children, variant = "primary", ...othersProps } = props
    const _style =
        variant === "primary"
            ? "button-primary"
            : variant === "error"
            ? "button-error"
            : variant === "non opaque"
            ? "button-non--opaque"
            : ""
    return (
        <button className={_style} {...othersProps}>
            {children}
        </button>
    )
}
