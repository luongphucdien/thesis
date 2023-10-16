import React, { useState } from "react"

interface DropdownProps extends React.PropsWithChildren {}

export const Dropdown = (props: DropdownProps) => {
    const { children } = props

    const [selectedOpion, setSelectedOption] = useState("")

    const filteredChildren = React.Children.map(children, (child) => {
        if ((child as React.ReactElement<any>).type === DropdownOption) {
            return child
        }
    })

    return (
        <div className="absolute top-14 flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-2 text-indigo-600">
            {filteredChildren}
        </div>
    )
}

export interface DropdownOptionProps extends React.PropsWithChildren {
    key: string
}

const DropdownOption = (props: DropdownOptionProps) => {
    const handleOnSelect = () => {}

    const { key, children } = props
    return (
        <div className="" key={key}>
            {children}
        </div>
    )
}
Dropdown.Option = DropdownOption
