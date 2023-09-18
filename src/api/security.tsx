import CryptoJS from "crypto-js"

const KEY = import.meta.env.VITE_SEC_KEY

export const encrypt = (data: string) => {
    return CryptoJS.AES.encrypt(data, KEY).toString()
}

export const decrypt = (data: string) => {
    return CryptoJS.AES.decrypt(data, KEY).toString(CryptoJS.enc.Utf8)
}
