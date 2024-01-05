import { useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { signIn } from "../../api"
import { Button } from "../../components/button"
import { FormControl } from "../../components/form-control"
import { TextField } from "../../components/text-field"

export const SignIn = () => {
    const [signInInfo, setSignInInfo] = useState<{email: string, password: string}>({
        email: "",
        password: ""
    })
    const [signInDisabler, setSignInDisabler] = useState(false)

    const handleSignIn = () => {
        setSignInDisabler(true)
        signIn(signInInfo, signInSuccess, signInError)
    }

    const [cookies, setCookies] = useCookies(["userToken", "userUID"])

    const nav = useNavigate()
    const signInSuccess = (token: string, userUID: string) => {
        setCookies("userToken", token, { path: "/", maxAge: 86400 })
        setCookies("userUID", userUID, {
            path: "/",
            maxAge: 86400,
        })
        alert("Sign in successfully!")
        nav(0)
    }

    const signInError = (errorCode: string) => {
        if (errorCode === "auth/invalid-email")
            alert("Email is invalid!\nPlease check your email again.")
        else if (errorCode === "auth/invalid-login-credentials")
            alert("Sign in error!\nEither your password is incorrect, or the email has not yet registered.\nPlease try again.")
        else
            alert("Sign in error!\nPlease try again.")
        setSignInDisabler(false)
        console.log(errorCode)
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-10">
                <IconContext.Provider value={{size: "52px"}}>
                    <a className="text-indigo-600"><TbAugmentedReality /></a>
                </IconContext.Provider>

                <div className="text-center gap-2 flex flex-col">
                    <p className="font-semibold text-3xl">Welcome to FloorPlannerAR</p>
                    <p className="text-2xl">Let&apos;s get you started!</p>
                </div>
                
                <div className="flex flex-col gap-6 w-full">
                    <FormControl>
                        <FormControl.Label htmlFor="email">Email</FormControl.Label>
                        <TextField id="email" onChange={e => setSignInInfo({...signInInfo, email: e.target.value})}/>
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <TextField type="password" onChange={e => setSignInInfo({...signInInfo, password: e.target.value})}/>
                    </FormControl>

                    <Button 
                        onClick={handleSignIn} 
                        disabled={signInDisabler || (signInInfo.email && signInInfo.password ? false : true)}
                    >
                        Sign In
                    </Button>
                </div>

                <p>Not a user? <Link to={"/sign-up"} className="text-indigo-600">Sign up here!</Link></p>
            </div>
        </div>
    )
}
