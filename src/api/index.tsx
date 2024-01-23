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
    signUpInfo: { email: string; password: string },
    setSignUpState: (state: boolean) => void,
    onSuccessCallback: () => void,
    onErrorCallback: (errorCode: string) => void
) => {
    const email = signUpInfo.email
    const password = signUpInfo.password

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
                onErrorCallback(res.data.errorCode)
            }
        })
        .catch(() => {
            setSignUpState(false)
            onErrorCallback("")
        })
}

export const signIn = async (
    signInInfo: { email: string; password: string },
    onSuccessCallback: (token: string, userUID: string) => void,
    onErrorCallback: (errorCode: string) => void
) => {
    const email = signInInfo.email
    const password = signInInfo.password
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
                onErrorCallback(res.data.code)
            }
        })
        .catch((err) => {
            onErrorCallback("")
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

export const fetchProjects = async (
    base64Email: string,
    onSuccessCallback: (projects: object) => void,
    onFailureCallback: () => void
) => {
    await axios
        .get(`${API_URL}/api/user/${base64Email}/projects`)
        .then((res) => {
            if (res.data.code === HttpStatusCode.Ok) {
                onSuccessCallback(res.data.projects)
            } else {
                onFailureCallback()
            }
        })
        .catch((error) => {
            onFailureCallback()
            console.log(error)
        })
}

export const deleteProject = async (name: string, userUID: string) => {
    await axios
        .delete(`${API_URL}/api/user/${userUID}/project/${name}`)
        .catch((error) => console.log(error))
}

export const saveCustomObjects = async (
    name: string,
    userUID: string,
    objects: object
) => {
    await axios
        .post(`${API_URL}/api/user/${userUID}/project/${name}/objects`, objects)
        .catch((error) => console.log(error))
}

export const uploadCustomObject = async (
    userUID: string,
    model: File,
    modelName: string
) => {
    await axios
        .post(`${API_URL}/api/user/${userUID}/models`, {
            model: model,
            modelName: modelName,
        })
        .catch((error) => console.log(error))
}

export const listCustomModels = async (
    userUID: string,
    onSuccess: (files: string[]) => void
) => {
    await axios
        .get(`${API_URL}/api/user/${userUID}/models`)
        .then((res) => onSuccess(res.data.files))
        .catch((error) => console.log(error))
}
