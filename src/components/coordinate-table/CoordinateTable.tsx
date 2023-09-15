import React from "react"

export const CoordinateTable = ({ children }: React.PropsWithChildren) => {
    return (
        <table className="table-fixed border-collapse overflow-hidden rounded-xl bg-gray-700 [&>*>tr>*]:px-4 [&>*>tr>*]:py-2 [&>tbody>tr:nth-child(even)]:bg-gray-500 [&>thead>tr]:bg-gray-500">
            <thead>
                <tr>
                    <th />
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                </tr>
            </thead>

            <tbody>
                {React.Children.map(children, (child) => (
                    <>{child}</>
                ))}
            </tbody>
        </table>
    )
}

const Row = ({ children }: React.PropsWithChildren) => {
    return (
        <tr>
            {React.Children.map(children, (child) => (
                <>{child}</>
            ))}
        </tr>
    )
}
CoordinateTable.Row = Row

const Column = ({ children }: React.PropsWithChildren) => {
    return <td>{children}</td>
}
CoordinateTable.Column = Column
