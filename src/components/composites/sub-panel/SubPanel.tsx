interface SubPanelProps extends React.PropsWithChildren {
    isOpen: boolean
}

export const SubPanel = (props: SubPanelProps) => {
    const { children, isOpen } = props
    return (
        <div
            className={`absolute right-96 top-20 rounded-xl bg-indigo-500 p-4 ${
                !isOpen && "hidden"
            }`}
        >
            {children}
        </div>
    )
}
