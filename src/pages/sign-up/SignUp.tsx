import { useEffect, useState } from "react"
import { FiArrowRight, FiCheck } from "react-icons/fi"
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

    const [tempDisabled, setTempDisabled] = useState(false)
    const [emailValid, setEmailValid] = useState(false)

    const handleEmailExisted = () => {
        setTempDisabled(false)
    }
    const handleEmailNotExisted = () => {
        setEmailValid(true)
    }

    const checkEmail = (email: string) => {
        setTempDisabled(true)
        checkIfEmailExisted(email, handleEmailExisted, handleEmailNotExisted)
    }

    const handleSignUp = () => {
        // console.log(`Email: ${email} | Password: ${password}`)
        signUp(email, password)
    }

    return (
        <div className="flex h-full items-center justify-center px-96 py-20">
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
                                disabled={tempDisabled || emailValid}
                            >
                                {!emailValid ? <FiArrowRight /> : <FiCheck />}
                            </IconButton>
                        </span>
                    </div>
                </div>

                {emailValid && (
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
                )}

                {emailValid && (
                    <FormControl>
                        <FormControl.Label>
                            Re-enter your password
                        </FormControl.Label>
                        <TextField
                            onChange={(event) => setRePW(event.target.value)}
                            type="password"
                        />
                    </FormControl>
                )}

                {emailValid && (
                    <div>
                        <Button disabled={!isPWMatched} onClick={handleSignUp}>
                            Continue
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
