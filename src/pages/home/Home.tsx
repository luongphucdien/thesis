import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { Button, LinkButton } from "../../components/button"

export const Home = () => {
    // ---FOR MOBILE TEST ONLY, REMOVE FOR PRODUCTION BUILD--- //
    const nav = useNavigate()
    const [cookies, setCookies] = useCookies(["userToken", "userUID"])
    // const userUID = Buffer.from("work.luongphucdien@gmail.com").toString(
    //     "base64"
    // )
    const mobileTest = () => {
        setCookies("userToken", "TEST---FOR MOBILE ONLY", {
            path: "/",
            maxAge: 86400,
        })
        // setCookies("userUID", userUID, { path: "/", maxAge: 86400 })
        nav(0)
    }
    // ---FOR MOBILE TEST ONLY, REMOVE FOR PRODUCTION BUILD--- //
    // ---END--- //

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

                <Button onClick={mobileTest}>FOR MOBILE ONLY</Button>
            </div>
        </div>
    )
}
