import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export const PrivatePage = ({ children }: React.PropsWithChildren) => {
    const nav = useNavigate()
    const [cookies] = useCookies(["userToken"])
    useEffect(() => {
        !cookies.userToken && nav("/")
    }, [])
    return <>{children}</>
}
