import { signUp } from "../../api"
import { Button } from "../../components/button"

export const SignUp = () => {
    const testSignUpInfo = {
        email: "work.luongphucdien@gmail.com",
        password: "testpassword",
    }

    const handleSignUp = () => {
        signUp(testSignUpInfo.email, testSignUpInfo.password)
    }

    return (
        <div className="flex h-full flex-col items-center justify-center">
            <Button onClick={handleSignUp}>Test Sign Up</Button>
        </div>
    )
}
