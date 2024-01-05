import { useEffect, useState } from "react"
import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "../../api"
import { Button } from "../../components/button"
import { FormControl } from "../../components/form-control"
import { TextField } from "../../components/text-field"

export const SignUp = () => {
    const [rePW, setRePW] = useState("")

    const [signUpInfo, setSignUpInfo] = useState<{email: string, password: string}>({
        email: "",
        password: ""
    })

    const [isPWMatched, setIsPWMatched] = useState(false)
    useEffect(() => {
        signUpInfo.password !== "" && rePW !== ""
            ? signUpInfo.password === rePW
                ? setIsPWMatched(true)
                : setIsPWMatched(false)
            : setIsPWMatched(false)
    }, [rePW, signUpInfo.password])

    const [signingUp, setSigningUp] = useState(false)

    const handleSignUp = () => {
        setSigningUp(true)
        signUp(
            signUpInfo,
            setSigningUp,
            handleSignUpDone,
            handleSignUpError
        )
    }

    const nav = useNavigate()
    const handleSignUpDone = () => {
        alert("Sign up successfully!")
        nav(0)
    }

    const handleSignUpError = (errorCode: string) => {
        if (errorCode === "auth/email-already-in-use")
            alert("Email is already in used!\nPlease try again with another email.")
        else if (errorCode === "auth/invalid-email")
            alert("Email is invalid!\nPlease check your email again, or try another one.")
        else if (errorCode === "auth/weak-password")
            alert("Your password is too weak!\nPlease try again with another stronger password.")
        else
            alert("Sign up error!\nPlease try again!")
        setSigningUp(false)
        console.log(errorCode)
    }

    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-10">
                <IconContext.Provider value={{size: "52px"}}>
                    <a className="text-indigo-500"><TbAugmentedReality /></a>
                </IconContext.Provider>

                <div className="text-center gap-2 flex flex-col">
                    <p className="font-semibold text-3xl">Let&apos;s create your account!</p>
                </div>
                
                <div className="flex flex-col gap-6 w-full">
                    <FormControl>
                        <FormControl.Label htmlFor="email">Email</FormControl.Label>
                        <TextField id="email" onChange={e => setSignUpInfo({...signUpInfo, email: e.target.value})}/>
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <TextField type="password" onChange={e => setSignUpInfo({...signUpInfo, password: e.target.value})}/>
                    </FormControl>

                    <FormControl>
                        <FormControl.Label htmlFor="email">Re-type Password</FormControl.Label>
                        <TextField type="password" onChange={e => setRePW(e.target.value)}/>
                    </FormControl>
                </div>

                <Button 
                    onClick={handleSignUp}
                    disabled={!isPWMatched || signingUp}
                >
                    Sign Up
                </Button>

                <p>Already had an account? <Link to={"/"} className="text-indigo-500">Sign in here!</Link></p>
            </div>
        
            
        </div>
    )
}
