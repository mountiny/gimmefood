import React from 'react'

const AdminActionButton = ({className, handleClick, children}) => {

  return (
    <button className={`admin-action__button ${className}`} onClick={handleClick}>
      {children}
    </button>
  )
}

export default AdminActionButton