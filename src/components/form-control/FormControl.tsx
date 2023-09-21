import React, { LabelHTMLAttributes, useId } from "react"
import { TextField, TextFieldProps } from "../text-field/TextField"

interface FormControlProps extends React.PropsWithChildren {
    name?: string
    isRequired?: boolean
}

export const FormControl = (props: FormControlProps) => {
    const { name, children, isRequired = false } = props

    const id = `fc-${useId()}-input`

    const filteredChildren = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            if ((child as React.ReactElement<any>).type === TextField) {
                return React.cloneElement(
                    child as React.ReactElement<TextFieldProps>,
                    {
                        id: id,
                        name: name,
                    }
                )
            } else if ((child as React.ReactElement<any>).type === Label) {
                return React.cloneElement(
                    child as React.ReactElement<LabelProps>,
                    { htmlFor: id, isRequired: isRequired }
                )
            } else return child
        } else {
            return child
        }
    })

    return <div className="flex flex-col gap-2">{filteredChildren}</div>
}

interface FormControlExtrasProps extends React.PropsWithChildren {}

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    isRequired?: boolean
}

const Label = (props: LabelProps) => {
    const { children, isRequired = false } = props
    return (
        <label {...props} className="px-4 font-semibold">
            <>{children}</>
            {isRequired && <span className="ml-1 text-red-400">*</span>}
        </label>
    )
}
FormControl.Label = Label

const HelperText = ({ children }: FormControlExtrasProps) => {
    return <p className="px-4 text-sm text-neutral-300">{children}</p>
}
FormControl.HelperText = HelperText

const ErrorText = ({ children }: FormControlExtrasProps) => {
    return <p className="px-4 text-sm text-red-400">{children}</p>
}
FormControl.ErrorText = ErrorText
