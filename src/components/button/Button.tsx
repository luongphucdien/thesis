export interface ButtonProps extends React.PropsWithChildren {}

export const Button = (props: ButtonProps) => {
    const { children } = props
    return <button className="button">{children}</button>
}
