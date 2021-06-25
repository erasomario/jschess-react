import { useState } from 'react'

export const useRadio = (init = null) => {
    const [selected, setSelected] = useState(init)
    return [
        value => {
            const myVal = value
            return {                
                value: myVal,
                checked: myVal === selected,
                onChange: ()=>{setSelected(myVal)},
                type: 'radio'
            }
        },
        selected, 
        setSelected
    ]
}