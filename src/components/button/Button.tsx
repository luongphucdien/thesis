export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = (props: ButtonProps) => {
    const { children, ...othersProps } = props
    return (
        <button className="button" {...othersProps}>
            {children}
        </button>
    )
}

const Primary = (props: ButtonProps) => {
    const { children } = props
    return (
        <button {...props} className="button-primary">
            {children}
        </button>
    )
}
Button.Primary = Primary
