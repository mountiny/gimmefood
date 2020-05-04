import { useState } from 'react'

const useField = (type, val = '') => {
  const [value, setValue] = useState(val)

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export default useField