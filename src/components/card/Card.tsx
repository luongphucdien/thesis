interface CardProps extends React.PropsWithChildren {
    elevation?: 1 | 2 | 3 | 4 | 5 | 0
}

export const Card = (props: CardProps) => {
    const { children, elevation = 0 } = props

    const elevationArray = [
        "card-level-one",
        "card-level-two",
        "card-level-three",
        "card-level-four",
        "card-level-five",
    ]

    return (
        <div
            className={`card overflow-hidden ${
                elevation !== 0 ? elevationArray[elevation - 1] : ""
            }`}
        >
            {children}
        </div>
    )
}
