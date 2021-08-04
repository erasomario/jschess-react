import { useCallback, useState } from 'react'

export const useRadio = (init = null, cb) => {
    const [selected, setSelected] = useState(init)
    const changed = useCallback((v) => { setSelected(v); if (cb) { cb(v) } }, [cb])
    return [
        value => {
            const myVal = value
            return {
                id: myVal,
                value: myVal,
                checked: myVal === selected,
                onChange: () => changed(myVal),
                type: "radio"
            }
        },
        selected,
        setSelected
    ]
}