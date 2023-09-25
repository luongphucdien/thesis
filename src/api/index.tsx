import axios, { HttpStatusCode } from "axios"
import { Buffer } from "buffer"
import { encrypt } from "./security"

const _raw_API_URL: string = import.meta.env.VITE_API_URL
const API_URL = _raw_API_URL.replace(/["]+/g, "")

export const testConnection = async () => {
    return await axios
        .get(`${API_URL}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
}

export const checkIfEmailExisted = async (
    email: string,
    isExistedCallback: () => void,
    isNotExistedCallback: () => void
) => {
    const base64Email = Buffer.from(email).toString("base64")

    return await axios
        .get(`${API_URL}/api/users/${base64Email}`)
        .then((res) => {
            if (res.data.code === HttpStatusCode.NotFound)
                isNotExistedCallback()
            else if (res.data.code === HttpStatusCode.Ok) isExistedCallback()
        })
        .catch((err) => console.log(err))
}

export const signUp = async (
    email: string,
    password: string,
    setSignUpState: (state: boolean) => void,
    signUpDoneCallback: () => void
) => {
    const _encryptedPW = encrypt(password)
    const _base64Email = Buffer.from(email).toString("base64")

    return await axios
        .post(`${API_URL}/api/users`, {
            email: email,
            base64Email: _base64Email,
            password: _encryptedPW,
        })
        .then((res) => {
            if (res.data.code === HttpStatusCode.Ok) {
                setSignUpState(true)
                signUpDoneCallback()
            } else setSignUpState(false)
        })
        .catch(() => {
            setSignUpState(false)
        })
}
