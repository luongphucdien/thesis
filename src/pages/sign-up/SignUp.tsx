import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { fadeUpStaggered } from "../../anim-variants/AnimVariants"
import { signUp } from "../../api"
import { FadeIn } from "../../components/animation"
import { Button } from "../../components/button"
import { FormControl } from "../../components/form-control"
import { TextField } from "../../components/text-field"

export const SignUp = () => {
    const [rePW, setRePW] = useState("")

    const [signUpInfo, setSignUpInfo] = useState<{
        email: string
        password: string
    }>({
        email: "",
        password: "",
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
        signUp(signUpInfo, setSigningUp, handleSignUpDone, handleSignUpError)
    }

    const nav = useNavigate()
    const handleSignUpDone = () => {
        alert("Sign up successfully!")
        nav(0)
    }

    const handleSignUpError = (errorCode: string) => {
        if (errorCode === "auth/email-already-in-use")
            alert(
                "Email is already in used!\nPlease try again with another email."
            )
        else if (errorCode === "auth/invalid-email")
            alert(
                "Email is invalid!\nPlease check your email again, or try another one."
            )
        else if (errorCode === "auth/weak-password")
            alert(
                "Your password is too weak!\nPlease try again with another stronger password."
            )
        else alert("Sign up error!\nPlease try again!")
        setSigningUp(false)
        console.log(errorCode)
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-10">
                <FadeIn>
                    <IconContext.Provider value={{ size: "52px" }}>
                        <a className="text-indigo-500">
                            <TbAugmentedReality />
                        </a>
                    </IconContext.Provider>
                </FadeIn>

                <FadeIn>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-3xl font-semibold">
                            Let&apos;s create your account!
                        </p>
                    </div>
                </FadeIn>

                <motion.div
                    className="flex w-full flex-col gap-6"
                    variants={fadeUpStaggered}
                    initial="start"
                    animate="end"
                >
                    <motion.div variants={fadeUpStaggered}>
                        <FormControl>
                            <FormControl.Label htmlFor="email">
                                Email
                            </FormControl.Label>
                            <TextField
                                id="email"
                                onChange={(e) =>
                                    setSignUpInfo({
                                        ...signUpInfo,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </FormControl>
                    </motion.div>

                    <motion.div variants={fadeUpStaggered}>
                        <FormControl>
                            <FormControl.Label>Password</FormControl.Label>
                            <TextField
                                type="password"
                                onChange={(e) =>
                                    setSignUpInfo({
                                        ...signUpInfo,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </FormControl>
                    </motion.div>

                    <motion.div variants={fadeUpStaggered}>
                        <FormControl>
                            <FormControl.Label htmlFor="email">
                                Re-type Password
                            </FormControl.Label>
                            <TextField
                                type="password"
                                onChange={(e) => setRePW(e.target.value)}
                            />
                        </FormControl>
                    </motion.div>

                    <motion.div variants={fadeUpStaggered}>
                        <Button
                            onClick={handleSignUp}
                            disabled={!isPWMatched || signingUp}
                        >
                            Sign Up
                        </Button>
                    </motion.div>
                </motion.div>

                <FadeIn>
                    <p>
                        Already had an account?{" "}
                        <Link to={"/"} className="text-indigo-500">
                            Sign in here!
                        </Link>
                    </p>
                </FadeIn>
            </div>
        </div>
    )
}
