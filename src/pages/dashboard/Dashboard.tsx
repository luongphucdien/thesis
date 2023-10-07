import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { FaPlus } from "react-icons/fa"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { TbAugmentedReality, TbMenu } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/button"
import { CoordinateTable } from "../../components/coordinate-table"
import { Modal } from "../../components/modal"
import { Slot } from "../../components/slot"
import { useDisclosure } from "../../util/useDisclosure"

export const Dashboard = () => {
    const [cookies, setCookies, removeCookie] = useCookies(["userToken"])

    useEffect(() => {
        cookies.userToken &&
            setCookies("userToken", cookies.userToken, {
                path: "/",
                maxAge: 86400,
            })
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
        nav(0)
    }

    const modalDisclosure = useDisclosure()

    const [isManualMode, setIsManualMode] = useState(false)

    const handleModalOnClose = () => {
        modalDisclosure.onClose()
        setIsManualMode(false)
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
                <Modal
                    isOpen={modalDisclosure.isOpen}
                    onClose={handleModalOnClose}
                >
                    {!isManualMode ? (
                        <DefaultModal setManualMode={setIsManualMode} />
                    ) : (
                        // <ManualMode />
                        <></>
                    )}
                </Modal>

                <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4 sm:gap-x-20">
                    <Link to="/project/new">
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
                </div>
            </div>
        </div>
    )
}

interface DefaultModalProps {
    setManualMode: (state: boolean) => void
}

const DefaultModal = ({ setManualMode }: DefaultModalProps) => {
    return (
        <>
            <div className="grid grid-cols-2 gap-10">
                <Link to={"/ar"}>
                    <Slot>
                        <div className="flex h-full w-full flex-col items-center justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-5 text-neutral-100">
                            <span>
                                <IconContext.Provider value={{ size: "24px" }}>
                                    <TbAugmentedReality />
                                </IconContext.Provider>
                            </span>
                            AR Mode
                        </div>
                    </Slot>
                </Link>

                <Slot onClick={() => setManualMode(true)}>
                    <div className="flex h-full w-full flex-col items-center justify-center whitespace-nowrap rounded-xl bg-indigo-600 px-5 text-neutral-100">
                        <span>
                            <IconContext.Provider value={{ size: "24px" }}>
                                <HiOutlineLocationMarker />
                            </IconContext.Provider>
                        </span>
                        Manual Mode
                    </div>
                </Slot>
            </div>
        </>
    )
}

const ManualModeOld = (props: {
    addMarkerCallback: (x: number, y: number, z: number) => void
    removeMarkerCallback: () => void
    markerList: { x: number; y: number; z: number }[]
}) => {
    const { addMarkerCallback, removeMarkerCallback, markerList } = props

    const [valueX, setValueX] = useState("0")
    const [valueY, setValueY] = useState("0")
    const [valueZ, setValueZ] = useState("0")
    return (
        <div className="flex flex-col gap-5">
            <div>
                <CoordinateTable>
                    {markerList.map((item, idx) => (
                        <CoordinateTable.Row key={`row-${idx}`}>
                            <CoordinateTable.Column>
                                Marker {idx + 1}
                            </CoordinateTable.Column>

                            <CoordinateTable.Column>
                                {item.x}
                            </CoordinateTable.Column>

                            <CoordinateTable.Column>
                                {item.y}
                            </CoordinateTable.Column>

                            <CoordinateTable.Column>
                                {item.z}
                            </CoordinateTable.Column>
                        </CoordinateTable.Row>
                    ))}
                    <CoordinateTable.Editable
                        editableTitle="New Marker:"
                        getEditableX={setValueX}
                        getEditableY={setValueY}
                        getEditableZ={setValueZ}
                    />
                </CoordinateTable>
            </div>

            <div className="flex gap-4">
                <span className="flex-1">
                    <Button variant="error" onClick={removeMarkerCallback}>
                        Remove
                    </Button>
                </span>

                <span className="flex-1">
                    <Button
                        variant="primary"
                        onClick={() =>
                            addMarkerCallback(
                                parseFloat(valueX),
                                parseFloat(valueY),
                                parseFloat(valueZ)
                            )
                        }
                    >
                        Add
                    </Button>
                </span>
            </div>
        </div>
    )
}
