import { createContext, useState } from "react"

export const Context = createContext();

export function ContextProvider({children}) {
    let Networks = useState({
        wifi:{
            ssid:'*****',
            connected:true,
        },
        mqtt:{
            ip:'127.0.0.1',
            port:1880,
            topic:'n3/telemetry',
            connected:false
        },
        ws:{
            ip:'192.168.0.0',
            port:1883,
            connected:false
        },
        map:{
            ip:'',
            port:1883,
            connected:false
        }
    })
    let Model = useState({
        x:0,
        y:0,
        z:0,
        zoom:0
    })
    return(
        <Context.Provider value={{Networks, Model}}>
            {children}
        </Context.Provider>
    )
}