import { IconContext } from "react-icons"

export interface TextFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactElement
}

export const TextField = (props: TextFieldProps) => {
    const { leftIcon } = props
    return (
        <div className="relative flex rounded-full text-neutral-100">
            {leftIcon && (
                <span className="pointer-events-none absolute left-0 inline-flex h-full items-center pl-3 pr-4">
                    <IconContext.Provider value={{ size: "24px" }}>
                        {leftIcon}
                    </IconContext.Provider>
                </span>
            )}

            <input
                className={`h-10 w-full rounded-full border border-neutral-400 bg-transparent px-4 outline-none outline-0 outline-offset-0 transition-all hover:border-neutral-100 focus:border-blue-400 focus:outline-none focus:outline-2 focus:outline-offset-0 focus:outline-blue-400 ${
                    leftIcon ? "pl-12" : ""
                }`}
                {...props}
            />
        </div>
    )
}
