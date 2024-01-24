import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { MdClose, MdOutlineFileUpload, MdOutlineRefresh } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { uploadCustomObject } from "../../../api"
import { CustomModelPreview } from "../../../core/editor/CustomModelPreview"
import { useDisclosure } from "../../../util/useDisclosure"
import { Button } from "../../button"
import { Modal } from "../../modal"

interface ModelLibraryProps extends React.PropsWithChildren {
    isOpen: boolean
    onClose: () => void
    onRefresh: () => void
}

export const ModelLibrary = (props: ModelLibraryProps) => {
    const { isOpen, onClose, children, onRefresh } = props

    const [customObj, setCustomObj] = useState<File | null>(null)
    const modelNameRef = useRef<HTMLInputElement>(null!)

    const [cookies, _] = useCookies(["userUID"])

    const nav = useNavigate()

    const uploadModel = () => {
        if (modelNameRef.current.value === "") {
            alert("Please provide the name of your model")
        } else {
            uploadCustomObject(
                cookies.userUID,
                customObj!,
                modelNameRef.current.value
            ).then(() => {
                alert("Upload Successfully!")
                nav(0)
            })
        }
    }

    const handleImportObj = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCustomObj(e.target.files[0])
        }
    }

    const resetImportObj = () => {
        setCustomObj(null)
    }

    const importModal = useDisclosure()

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className=" overflow-hidden">
                    <div className="relative mb-4">
                        <span
                            className="absolute right-0 top-0 rounded-full p-2 transition-all hover:bg-neutral-700/20 active:bg-neutral-700/30"
                            onClick={onClose}
                        >
                            <IconContext.Provider value={{ size: "24px" }}>
                                <MdClose />
                            </IconContext.Provider>
                        </span>

                        <span
                            className="absolute left-0 top-0 rounded-full p-2 transition-all hover:bg-neutral-700/20 active:bg-neutral-700/30"
                            title="Refresh"
                            onClick={onRefresh}
                        >
                            <IconContext.Provider value={{ size: "24px" }}>
                                <MdOutlineRefresh />
                            </IconContext.Provider>
                        </span>

                        <p className="text-center text-2xl">Model Library</p>
                    </div>

                    <div className="h-[80vh] w-[60vw] overflow-auto sm:h-[50vh] sm:w-[50vw] ">
                        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
                            {children}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div>
                            <Button onClick={importModal.onOpen}>
                                Add Custom Model
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={importModal.isOpen} onClose={importModal.onClose}>
                <div>
                    {!customObj && (
                        <div>
                            <label htmlFor="obj-uploader" className="">
                                <a className="inline-flex cursor-pointer flex-col items-center">
                                    <IconContext.Provider
                                        value={{ size: "48px" }}
                                    >
                                        <MdOutlineFileUpload />
                                    </IconContext.Provider>
                                    Upload your model here
                                </a>
                            </label>
                            <input
                                type="file"
                                id="obj-uploader"
                                className="hidden"
                                onChange={handleImportObj}
                                accept=".glb"
                            />
                        </div>
                    )}

                    {customObj && (
                        <div className="h-[50vh] w-[50vw] overflow-hidden">
                            <div className="flex h-full gap-8">
                                <Canvas>
                                    <CustomModelPreview rawFile={customObj} />
                                    <Environment
                                        preset="apartment"
                                        blur={0.1}
                                        background
                                    />
                                    <OrbitControls />
                                </Canvas>

                                <div className="flex flex-col justify-between whitespace-nowrap">
                                    <div className="flex flex-col items-center gap-2">
                                        <label
                                            className="text-center"
                                            htmlFor="model-name"
                                        >
                                            Model Name
                                        </label>
                                        <input
                                            id="model-name"
                                            ref={modelNameRef}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <Button
                                            variant="error"
                                            onClick={resetImportObj}
                                        >
                                            Change Model
                                        </Button>
                                        <Button onClick={uploadModel}>
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    )
}
