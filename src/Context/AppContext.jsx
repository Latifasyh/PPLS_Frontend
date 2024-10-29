import { createContext, useEffect, useState } from "react";

export const AppContext = createContext() ;

export default function AppProvider({children}){
    const [token, setToken]=useState(localStorage.getItem('token'));
    const [user, setUser]  = useState(null);


    async function getUser(){
        const res = await fetch('/api/user', {
            method:"GET",
            headers : {
            Authorization : `Bearer ${token}`,
            'Accept': 'application/json',
            },
            credentials: 'include', // Important pour Sanctum

        })
        const data = await res.json();

        setUser(data)
       
    }

    useEffect(() =>{
        if (token){
            getUser();
        }
    }, [token]);


    return (
        <AppContext.Provider value ={{token, setToken, user, setUser}}>
            {children}

        </AppContext.Provider>
    )
}