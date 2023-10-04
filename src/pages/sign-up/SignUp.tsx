import { useEffect, useState } from "react"
import { FiArrowRight, FiCheck } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { checkIfEmailExisted, signUp } from "../../api"
import { Button, IconButton } from "../../components/button"
import { FormControl } from "../../components/form-control"
import { TextField } from "../../components/text-field"

export const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rePW, setRePW] = useState("")

    const [isPWMatched, setIsPWMatched] = useState(false)
    useEffect(() => {
        password !== "" && rePW !== ""
            ? password === rePW
                ? setIsPWMatched(true)
                : setIsPWMatched(false)
            : setIsPWMatched(false)
    }, [rePW, password])

    const [checkEmailDisabler, setCheckEmailDisabler] = useState(false)
    const [emailExisted, setEmailExisted] = useState(false)

    const handleEmailExisted = () => {
        setCheckEmailDisabler(false)
        setEmailExisted(false)
        alert("This email has been used!")
    }
    const handleEmailNotExisted = () => {
        setEmailExisted(true)
    }

    const checkEmail = (email: string) => {
        setCheckEmailDisabler(true)
        checkIfEmailExisted(email, handleEmailExisted, handleEmailNotExisted)
    }

    const [signingUp, setSigningUp] = useState(false)

    const handleSignUp = () => {
        setSigningUp(true)
        signUp(
            email,
            password,
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

    const handleSignUpError = () => {
        alert("Sign Up Error!")
    }

    return (
        <div className="flex h-full items-center justify-center px-2 py-20 sm:px-96">
            <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-slate-700 py-14">
                <div className="flex flex-col gap-2">
                    <FormControl.Label htmlFor="email">
                        What is your email?
                    </FormControl.Label>

                    <div className="relative flex items-center gap-2">
                        <TextField
                            id="email"
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        <span className="absolute -right-12 transition-all">
                            <IconButton
                                onClick={() => checkEmail(email)}
                                disabled={checkEmailDisabler || emailExisted}
                            >
                                {!emailExisted ? <FiArrowRight /> : <FiCheck />}
                            </IconButton>
                        </span>
                    </div>
                </div>

                {emailExisted && (
                    <>
                        <FormControl>
                            <FormControl.Label>
                                Enter your password
                            </FormControl.Label>
                            <TextField
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                type="password"
                            />
                        </FormControl>

                        <FormControl>
                            <FormControl.Label>
                                Re-enter your password
                            </FormControl.Label>
                            <TextField
                                onChange={(event) =>
                                    setRePW(event.target.value)
                                }
                                type="password"
                            />
                        </FormControl>

                        <div>
                            <Button
                                disabled={!isPWMatched || signingUp}
                                onClick={handleSignUp}
                            >
                                Continue
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
