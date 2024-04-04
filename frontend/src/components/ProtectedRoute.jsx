import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

// this component is a 'wrapper' for all of our navigations
// checking the authorisation state of the user. 

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    // on load run auth function to check the ACCESS_TOKEN
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, []) 

    // tries refresh token 
    // if success sets new ACCESS_TOKEN
    // else authorised set to false
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch(error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    // first check if found
    // then check if expired
    // if expired - calls refreshToken
    // if not - authorises
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp 
        const now = Date.now()/1000

        // if token expired, refresh, else authorise
        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    } 

    if(isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute