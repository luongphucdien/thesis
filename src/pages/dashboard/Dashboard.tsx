import { useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { FaPlus } from "react-icons/fa"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/button"
import { CoordinateTable } from "../../components/coordinate-table"
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

    const [isManualMode, setIsManualMode] = useState(false)

    const handleModalOnClose = () => {
        modalDisclosure.onClose()
        setIsManualMode(false)
    }

    const [manualMarkers, setManualMarkers] = useState<
        { x: number; y: number; z: number }[]
    >([])

    const handleAddManualMarker = (x: number, y: number, z: number) => {
        setManualMarkers((manualMarkers) => [
            ...manualMarkers,
            { x: x, y: y, z: z },
        ])
    }
    const handleRemoveManualMarker = () => {
        setManualMarkers(manualMarkers.slice(0, -1))
    }

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
                        <Button variant="non opaque">Profile</Button>
                    </div>
                    <div>
                        <Button onClick={handleSignOut} variant="non opaque">
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            <div className="h-full w-full p-5 px-10">
                <Modal
                    isOpen={modalDisclosure.isOpen}
                    onClose={handleModalOnClose}
                >
                    {!isManualMode ? (
                        <DefaultModal setManualMode={setIsManualMode} />
                    ) : (
                        <ManualMode
                            addMarkerCallback={handleAddManualMarker}
                            removeMarkerCallback={handleRemoveManualMarker}
                            markerList={manualMarkers}
                        />
                    )}
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

const ManualMode = (props: {
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
                        Remove Marker
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
                        Add Marker
                    </Button>
                </span>
            </div>
        </div>
    )
}
