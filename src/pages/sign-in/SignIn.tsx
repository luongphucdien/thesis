import { useState } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { signIn } from "../../api"
import { Button } from "../../components/button"
import { FormControl } from "../../components/form-control"
import { TextField } from "../../components/text-field"

export const SignIn = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signInDisabler, setSignInDisabler] = useState(false)

    const handleSignIn = () => {
        setSignInDisabler(true)
        signIn(email, password, signInSuccess, signInError)
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

    const signInError = () => {
        alert("Sign in error")
        nav(0)
    }

    return (
        <div className="flex h-full items-center justify-center px-2 sm:px-96">
            <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-slate-700 py-14">
                <FormControl id="email">
                    <FormControl.Label>Email</FormControl.Label>
                    <TextField
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormControl.Label>Password</FormControl.Label>
                    <TextField
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </FormControl>

                <div>
                    <Button
                        variant="non opaque"
                        onClick={handleSignIn}
                        disabled={
                            signInDisabler || (email && password ? false : true)
                        }
                    >
                        Sign In
                    </Button>
                </div>
            </div>
        </div>
    )
}
