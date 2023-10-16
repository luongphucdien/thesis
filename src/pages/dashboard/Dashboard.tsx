import { useLocalStorage } from "@uidotdev/usehooks"
import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { FaPlus } from "react-icons/fa"
import { TbAugmentedReality, TbMenu } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { fetchProjects } from "../../api"
import { Button } from "../../components/button"
import { Slot } from "../../components/slot"
import { ProjectObjects } from "../../core/editor/Editor"
import { useDisclosure } from "../../util/useDisclosure"

export const Dashboard = () => {
    const [cookies, setCookies, removeCookie] = useCookies([
        "userToken",
        "userUID",
    ])

    const [projects, setProjects] = useLocalStorage<ProjectObjects[]>(
        "projects",
        [
            {
                markers: [],
                name: "",
            },
        ]
    )

    const onFetchSuccess = (projects: object) => {
        setProjects(Object.values(projects))
    }
    const onFetchFailure = () => {
        console.log("Failed")
    }

    useEffect(() => {
        cookies.userToken &&
            setCookies("userToken", cookies.userToken, {
                path: "/",
                maxAge: 86400,
            })

        cookies.userUID &&
            setCookies("userUID", cookies.userUID, {
                path: "/",
                maxAge: 86400,
            })

        fetchProjects(cookies.userUID, onFetchSuccess, onFetchFailure)
    }, [])

    const collapsibleDisclosure = useDisclosure()
    const handleSideCollapsible = () => {
        collapsibleDisclosure.isOpen
            ? collapsibleDisclosure.onClose()
            : collapsibleDisclosure.onOpen()
    }

    const nav = useNavigate()
    const handleSignOut = () => {
        removeCookie("userToken")
        removeCookie("userUID")
        nav(0)
    }

    return (
        <div className="flex h-full">
            <div
                className={`absolute h-full w-60 sm:static sm:w-72 ${
                    collapsibleDisclosure.isOpen ? "left-0" : "-left-60"
                }`}
            >
                <div className="relative h-full">
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
                                <Button variant="non opaque">Profile</Button>
                            </div>
                            <div>
                                <Button
                                    onClick={handleSignOut}
                                    variant="non opaque"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>

                    <span
                        className="absolute bottom-5 left-64 sm:hidden"
                        onClick={handleSideCollapsible}
                    >
                        <IconContext.Provider value={{ size: "24px" }}>
                            <TbMenu />
                        </IconContext.Provider>
                    </span>
                </div>
            </div>

            <div className="h-full flex-1 p-5 sm:px-10">
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4 sm:gap-x-20">
                    <Link to="/project/new" className="hidden sm:block">
                        <Slot>
                            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-8 border-dashed text-gray-400">
                                <span>
                                    <IconContext.Provider
                                        value={{ size: "32px" }}
                                    >
                                        <FaPlus />
                                    </IconContext.Provider>
                                </span>
                                Add Floor Plan
                            </div>
                        </Slot>
                    </Link>

                    <Link to="/ar" className="sm:hidden">
                        <Slot>
                            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border-8 border-dashed text-gray-400">
                                <span>
                                    <IconContext.Provider
                                        value={{ size: "32px" }}
                                    >
                                        <FaPlus />
                                    </IconContext.Provider>
                                </span>
                                Add Floor Plan
                            </div>
                        </Slot>
                    </Link>

                    {projects.map((proj) => (
                        <Link key={proj.name} to={`/project/${proj.name}`}>
                            <Slot>
                                <div className="flex h-full flex-col items-center justify-center rounded-2xl border-8 text-gray-600">
                                    <p className="text-2xl font-bold">
                                        {proj.name}
                                    </p>
                                </div>
                            </Slot>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
