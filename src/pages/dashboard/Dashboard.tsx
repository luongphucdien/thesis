import { IconContext } from "react-icons"
import { FaPlus } from "react-icons/fa"
import { TbAugmentedReality } from "react-icons/tb"
import { Button } from "../../components/button"
import { SidebarLayout } from "../../components/layout"
import { Slot } from "../../components/slot"

export const Dashboard = () => {
    return (
        <SidebarLayout>
            <div className="flex h-full flex-col gap-5 bg-indigo-600 px-6 pb-10 pt-4 text-neutral-100">
                <div>
                    <span>
                        <IconContext.Provider value={{ size: "40px" }}>
                            <TbAugmentedReality />
                        </IconContext.Provider>
                    </span>
                </div>

                <div className="flex h-full flex-col">
                    <div className="flex-1">
                        <Button>Profile</Button>
                    </div>
                    <div>
                        <Button>Sign Out</Button>
                    </div>
                </div>
            </div>

            <div className="h-full w-full p-5 px-10">
                <div className="grid grid-cols-4 gap-x-20 gap-y-5">
                    <Slot>
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-8 border-dashed text-gray-400">
                            <span>
                                <IconContext.Provider value={{ size: "32px" }}>
                                    <FaPlus />
                                </IconContext.Provider>
                            </span>
                            Add Floor Plan
                        </div>
                    </Slot>
                </div>
            </div>
        </SidebarLayout>
    )
}
