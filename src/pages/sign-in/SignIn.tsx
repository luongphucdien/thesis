import { motion } from "framer-motion"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { IconContext } from "react-icons"
import { TbAugmentedReality } from "react-icons/tb"
import { Link, useNavigate } from "react-router-dom"
import { fadeUpStaggered } from "../../anim-variants/AnimVariants"
import { signIn } from "../../api"
import { FadeIn } from "../../components/animation"
import { Button } from "../../components/button"
import { FormControl } from "../../components/form-control"
import { TextField } from "../../components/text-field"

export const SignIn = () => {
    const [signInInfo, setSignInInfo] = useState<{
        email: string
        password: string
    }>({
        email: "",
        password: "",
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
            alert(
                "Sign in error!\nEither your password is incorrect, or the email has not yet registered.\nPlease try again."
            )
        else alert("Sign in error!\nPlease try again.")
        setSignInDisabler(false)
        console.log(errorCode)
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-10 px-10 sm:px-0">
                <FadeIn>
                    <IconContext.Provider value={{ size: "52px" }}>
                        <a className="text-indigo-600">
                            <TbAugmentedReality />
                        </a>
                    </IconContext.Provider>
                </FadeIn>

                <FadeIn>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-3xl font-semibold">
                            Welcome to FloorPlannerAR
                        </p>
                        <p className="text-2xl">Let&apos;s get you started!</p>
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
                                    setSignInInfo({
                                        ...signInInfo,
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
                                    setSignInInfo({
                                        ...signInInfo,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </FormControl>
                    </motion.div>

                    <motion.div variants={fadeUpStaggered}>
                        <Button
                            onClick={handleSignIn}
                            disabled={
                                signInDisabler ||
                                (signInInfo.email && signInInfo.password
                                    ? false
                                    : true)
                            }
                        >
                            Sign In
                        </Button>
                    </motion.div>
                </motion.div>

                <FadeIn>
                    <p>
                        Not a user?{" "}
                        <Link to={"/sign-up"} className="text-indigo-600">
                            Sign up here!
                        </Link>
                    </p>
                </FadeIn>
            </div>
        </div>
    )
}
