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
