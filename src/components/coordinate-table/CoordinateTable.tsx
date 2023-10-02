import React, { useEffect, useRef, useState } from "react"

type CoordinateTable<T extends boolean> = React.PropsWithChildren<
    T extends true ? { editableTitle?: string } : Record<string, never>
>

export const CoordinateTable = <T extends boolean = false>(
    props: { isEditable?: T } & CoordinateTable<T>
) => {
    const { children, isEditable, editableTitle } = props
    return (
        <table className="table-new">
            <thead>
                <tr>
                    <th />
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                </tr>
            </thead>

            <tbody>
                {isEditable && (
                    <tr>
                        <td>{editableTitle}</td>
                        <td>
                            <EditableInput />
                        </td>
                        <td>
                            <EditableInput />
                        </td>
                        <td>
                            <EditableInput />
                        </td>
                    </tr>
                )}
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

const EditableInput = () => {
    const [value, setValue] = useState("")

    useEffect(() => {
        setWidth(spanRef.current ? spanRef.current.offsetWidth : 0)
    }, [value])

    const [width, setWidth] = useState(0)
    const spanRef = useRef<HTMLSpanElement>(null)

    return (
        <div className="relative flex flex-col">
            <span className="invisible absolute" ref={spanRef}>
                {value}
            </span>

            <input
                className="min-w-[40px] max-w-xs text-neutral-800"
                onChange={(e) => setValue(e.target.value)}
                style={{ width }}
            />
        </div>
    )
}
