import { IconContext } from "react-icons"
import { HiOutlineMenuAlt2 } from "react-icons/hi"

interface TopAppBarProps {
    menuItems: MenuItem[]
}

export interface MenuItem {
    title: string
    id: string
}

export const TopAppBar = (props: TopAppBarProps) => {
    const { menuItems } = props
    return (
        <>
            <div className="flex h-16 rounded-b-xl bg-neutral-50 shadow-md sm:h-20">
                <div className="flex w-full flex-row items-center gap-4 px-4 text-lg sm:gap-8 sm:px-8 sm:text-xl">
                    <IconContext.Provider value={{ size: "32px" }}>
                        <div className="sm:hidden">
                            <HiOutlineMenuAlt2 />
                        </div>

                        <div className="font-semibold">Title</div>

                        <hr className="hidden h-full w-[1px] bg-gray-200 sm:block" />

                        <div className="flex-1 [&>*]:hidden [&>*]:sm:block">
                            <p>Menu</p>
                        </div>

                        <div className="">End</div>
                    </IconContext.Provider>
                </div>
            </div>
        </>
    )
}
