import React from 'react'

const UnderlineText = ({
  className,
  children
}) => {
  return (
    <div className={`${className} h-offset-wrapper h-offset-bg`}>
      {children}
    </div>
  )
}

export default UnderlineText