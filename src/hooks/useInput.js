import { useState, useRef, useCallback } from 'react'

export const useInput = (initialValue = '') => {
    const ref = useRef(null)
    const [value, setValue] = useState(initialValue);
    return [
        { value, onChange: e => setValue(e.target.value), ref },//props
        setValue,
        useCallback(() => { ref.current && ref.current.focus() }, [ref])//grabfocus
    ];
}