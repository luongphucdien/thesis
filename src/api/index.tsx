import axios from "axios"
import { encrypt } from "./security"

const _raw_API_URL: string = import.meta.env.VITE_API_URL
const API_URL = _raw_API_URL.replace(/["]+/g, "")

export const testConnection = async () => {
    return await axios
        .get(`${API_URL}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
}

export const signUp = async (email: string, password: string) => {
    const _encryptedPW = encrypt(password)
    return await axios
        .post(`${API_URL}/api/user`, {
            email: email,
            password: _encryptedPW,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
}
