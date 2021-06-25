import { useState, useRef } from 'react'

export const useInput = (initialValue = '') => {
    const ref = useRef(null)
    const [value, setValue] = useState(initialValue);
    return [
        { value, onChange: e => setValue(e.target.value), ref },//props
        (val = initialValue) => setValue(val),//setval
        () => ref.current && ref.current.focus()//grabfocus
    ];
}