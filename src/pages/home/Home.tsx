import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { LinkButton } from "../../components/button"

export const Home = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center text-neutral-100">
            <IconContext.Provider value={{ size: "250px" }}>
                <TbAugmentedReality />
            </IconContext.Provider>

            <div className="flex flex-col gap-5">
                <LinkButton to="/sign-up" variant="non opaque">
                    To Sign Up
                </LinkButton>

                <LinkButton to="/sign-in" variant="non opaque">
                    To Sign In
                </LinkButton>
            </div>
        </div>
    )
}
