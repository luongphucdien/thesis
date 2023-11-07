import { useLocalStorage } from "@uidotdev/usehooks"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { FaPlus } from "react-icons/fa"
import { TbAugmentedReality, TbMenu } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { slideRight } from "../../anim-variants/AnimVariants"
import { deleteProject, fetchProjects } from "../../api"
import { Button } from "../../components/button"
import { Modal } from "../../components/modal"
import { Slot } from "../../components/slot"
import { ProjectObjects } from "../../core/ObjectInterface"
import { timeout } from "../../util/misc"
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
                floors: [],
                name: "",
            },
        ]
    )

    const onFetchSuccess = (projects: object) => {
        setProjects(projects ? Object.values(projects) : [])
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

    const deleteModalDisclosure = useDisclosure()
    const [projToBeDeleted, setProjToBeDeleted] = useState("")
    const openDeleteModel = (name: string) => {
        setProjToBeDeleted(name)
        deleteModalDisclosure.onOpen()
    }
    const handleDeleteProject = async (name: string) => {
        deleteProject(name, cookies.userUID).then(async () => {
            await timeout(1).then(() => {
                deleteModalDisclosure.onClose()
                nav(0)
            })
        })
    }

    return (
        <div className="flex h-full">
            <motion.div
                className={
                    "absolute z-[999] h-full w-60 sm:static sm:hidden sm:w-72"
                }
                initial="start"
                animate={collapsibleDisclosure.isOpen ? "end" : "start"}
                variants={slideRight}
                transition={{ ease: "easeInOut", duration: 0.2 }}
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
            </motion.div>

            <div
                className={
                    "absolute z-[999] hidden h-full w-60 sm:static sm:block sm:w-72"
                }
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
                    <Link to="/ar">
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
                        <div key={proj.name} className="group relative">
                            <Link to={`/project/${proj.name}`}>
                                <Slot>
                                    <div className="flex h-full flex-col items-center justify-center rounded-2xl border-8 text-gray-600">
                                        <p className="text-md font-semibold sm:text-2xl sm:font-bold">
                                            {proj.name}
                                        </p>
                                    </div>
                                </Slot>
                            </Link>

                            <div className="absolute -bottom-24 hidden w-full pt-8 group-hover:block">
                                <div className="rounded-lg bg-neutral-100 p-4 shadow-md">
                                    <Button
                                        variant="error"
                                        onClick={() =>
                                            openDeleteModel(proj.name)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Modal
                        isOpen={deleteModalDisclosure.isOpen}
                        onClose={deleteModalDisclosure.onClose}
                    >
                        <div className="flex flex-col items-center justify-center gap-5">
                            <p className="text-2xl font-medium text-neutral-800">
                                Delete {`"${projToBeDeleted}"`}?
                            </p>
                            <div className="flex justify-center gap-5">
                                <Button
                                    variant="primary"
                                    onClick={deleteModalDisclosure.onClose}
                                >
                                    No
                                </Button>
                                <Button
                                    variant="error"
                                    onClick={() =>
                                        handleDeleteProject(projToBeDeleted)
                                    }
                                >
                                    Yes
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    )
}
