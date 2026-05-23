import { useState, useEffect } from "react";
import api from "../api/axios.js";

const useAuth = () => {

    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/me")
            .then((res) => {
                setUser(res.data.user)
            })
            .catch(() => {
                setUser(null)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const logout = async () => {
        try{
            await api.post("/logout")
            setUser(null)
            toast.info("Profildan chiqtingiz!")
        }
        catch{
            toast.error("Profildan chiqishda xatolik!")
        }
    }

    return {user, setUser, logout, loading}
}

export default useAuth