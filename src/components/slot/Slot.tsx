import { HTMLAttributes } from "react"

interface SlotProps extends HTMLAttributes<HTMLDivElement> {}
export const Slot = ({ children, ...props }: SlotProps) => {
    return (
        <div
            className="aspect-square w-full cursor-pointer select-none"
            {...props}
        >
            {children}
        </div>
    )
}
