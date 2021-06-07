import { useState, useRef } from 'react'

export const useCheckbox = (initialValue = '') => {
    const ref = useRef(null)
    const [checked, setValue] = useState(initialValue);
    return [
        { checked, onChange: e => setValue(e.target.checked), ref },
        (val = initialValue) => setValue(val),
        () => ref.current && ref.current.focus()
    ];
}