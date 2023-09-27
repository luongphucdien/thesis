import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { Button, LinkButton } from "../../components/button"

export const Home = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["userToken"])

    useEffect(() => {
        cookies.userToken &&
            setCookie("userToken", cookies.userToken, {
                path: "/",
                maxAge: 86400,
            })
    }, [])

    const handleSignOut = () => {
        removeCookie("userToken")
    }

    return (
        <div className="flex h-full flex-col items-center justify-center text-neutral-100">
            <IconContext.Provider value={{ size: "250px" }}>
                <TbAugmentedReality />
            </IconContext.Provider>

            <div className="flex flex-col gap-5">
                {cookies.userToken ? (
                    <>
                        <LinkButton to="/ar">Enter AR</LinkButton>
                        <LinkButton to="/dashboard">Dashboard</LinkButton>
                        <Button onClick={handleSignOut}>Sign Out</Button>
                    </>
                ) : (
                    <>
                        <LinkButton to="/sign-up">To Sign Up</LinkButton>
                        <LinkButton to="/sign-in">To Sign In</LinkButton>
                    </>
                )}
            </div>
        </div>
    )
}
