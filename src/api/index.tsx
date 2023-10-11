import axios, { HttpStatusCode } from "axios"
import { Buffer } from "buffer"

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
    onSuccessCallback: () => void,
    onErrorCallback: () => void
) => {
    const _base64Email = Buffer.from(email).toString("base64")

    await axios
        .post(`${API_URL}/api/users`, {
            email: email,
            base64Email: _base64Email,
            password: password,
        })
        .then((res) => {
            if (res.data.code === HttpStatusCode.Ok) {
                setSignUpState(true)
                onSuccessCallback()
            } else {
                setSignUpState(false)
                onErrorCallback()
            }
            console.log(res.data)
        })
        .catch(() => {
            setSignUpState(false)
            onErrorCallback()
        })
}

export const signIn = async (
    email: string,
    password: string,
    onSuccessCallback: (token: string, userUID: string) => void,
    onErrorCallback: () => void
) => {
    const _base64Email = Buffer.from(email).toString("base64")

    await axios
        .post(`${API_URL}/api/user/${_base64Email}`, {
            email: email,
            password: password,
            base64Email: _base64Email,
        })
        .then((res) => {
            if (res.data.code === HttpStatusCode.Ok) {
                onSuccessCallback(res.data.userToken, _base64Email)
            } else {
                onErrorCallback()
            }

            console.log({
                data: res.data,
                sourceData: {
                    email: email,
                    pw: password,
                    base64Email: _base64Email,
                },
            })
        })
        .catch((err) => {
            onErrorCallback()
            console.log(err)
        })
}

export const saveProject = async (
    base64Email: string,
    project: object,
    projectName: string,
    onSuccessCallback: () => void,
    onFailureCallback: () => void
) => {
    await axios
        .post(
            `${API_URL}/api/user/${base64Email}/project/${projectName}`,
            project
        )
        .then((res) => {
            if (res.data.code === HttpStatusCode.Ok) {
                onSuccessCallback()
            } else {
                onFailureCallback()
            }
        })
        .catch((error) => {
            onFailureCallback()
            console.log(error)
        })
}
