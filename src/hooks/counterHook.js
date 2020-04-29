import React, { useState } from 'react'

const useCounter = (max) => {
  const [value, setValue] = useState(0)

  const increase = () => {
    console.log(max)
    value !== max ? setValue(value + 1) : alert(`Unfortunately, we do not have more in stock.`)
  }

  const decrease = () => {
    if (value !== 0) setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value, 
    increase,
    decrease,
    zero
  }
}

export default useCounter