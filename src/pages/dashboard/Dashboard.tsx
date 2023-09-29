import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { FaPlus } from "react-icons/fa"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/button"
import { SidebarLayout } from "../../components/layout"
import { Modal } from "../../components/modal"
import { Slot } from "../../components/slot"
import { useDisclosure } from "../../util/useDisclosure"

export const Dashboard = () => {
    const [cookies, setCookies, removeCookie] = useCookies(["userToken"])
    const nav = useNavigate()
    const handleSignOut = () => {
        removeCookie("userToken")
        nav(0)
    }

    const modalDisclosure = useDisclosure()

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
                        <Button onClick={handleSignOut}>Sign Out</Button>
                    </div>
                </div>
            </div>

            <div className="h-full w-full p-5 px-10">
                <Modal
                    isOpen={modalDisclosure.isOpen}
                    onClose={modalDisclosure.onClose}
                >
                    <div className="grid grid-cols-2 gap-10">
                        <Link to={"/ar"}>
                            <Slot>
                                <div className="flex h-full w-full flex-col items-center justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-5 text-neutral-100">
                                    <span>
                                        <IconContext.Provider
                                            value={{ size: "24px" }}
                                        >
                                            <TbAugmentedReality />
                                        </IconContext.Provider>
                                    </span>
                                    AR Mode
                                </div>
                            </Slot>
                        </Link>

                        <Slot>
                            <div className="flex h-full w-full flex-col items-center justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-5 text-neutral-100">
                                <span>
                                    <IconContext.Provider
                                        value={{ size: "24px" }}
                                    >
                                        <HiOutlineLocationMarker />
                                    </IconContext.Provider>
                                </span>
                                Manual Mode
                            </div>
                        </Slot>
                    </div>
                </Modal>

                <div className="grid grid-cols-4 gap-x-20 gap-y-5">
                    <Slot onClick={modalDisclosure.onOpen}>
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
