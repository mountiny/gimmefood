import { useState } from 'react'

const useImageField = (type, val = '') => {
  const [value, setValue] = useState(val)

  const onChange = (event) => {
    setValue(event.target.files[0])
  }

  return {
    type,
    value,
    onChange
  }
}

export default useImageField