import React, { useEffect, useRef, useState } from "react"

type CoordinateTableProps = React.PropsWithChildren

export const CoordinateTable = (props: CoordinateTableProps) => {
    const { children } = props
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

interface EditableSectionProps {
    editableTitle: string
    getEditableX: (value: string) => void
    getEditableY: (value: string) => void
    getEditableZ: (value: string) => void
}

const EditableSection = (props: EditableSectionProps) => {
    const { editableTitle, getEditableX, getEditableY, getEditableZ } = props
    return (
        <tr>
            <td>{editableTitle}</td>
            <td>
                <EditableInput getValueCallback={getEditableX} />
            </td>
            <td>
                <EditableInput getValueCallback={getEditableY} />
            </td>
            <td>
                <EditableInput getValueCallback={getEditableZ} />
            </td>
        </tr>
    )
}
CoordinateTable.Editable = EditableSection

const EditableInput = (props: {
    getValueCallback: (value: string) => void
}) => {
    const { getValueCallback } = props

    const [value, setValue] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
        getValueCallback(e.target.value)
    }

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
                onChange={handleInputChange}
                style={{ width }}
                {...props}
            />
        </div>
    )
}
