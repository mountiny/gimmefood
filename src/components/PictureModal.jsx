import React, { useState, useEffect, useRef } from 'react'
import useLockBodyScroll from '../hooks/lockBodyScrollHook'
import useOnClickOutside from '../hooks/onClickOutsideHook'
import { IMAGES } from '../config'

const PictureModal = ({picture, onClose}) => {

  const ref = useRef()

  useLockBodyScroll()

  useOnClickOutside(ref, () => onClose())

  return (
    <div className="picture-modal modal">
      <img className="h-rounded" src={IMAGES + picture} alt="Product image" ref={ref}/>
      <div className="close-modal h-button h-pointer h-rounded" onClick={()=>onClose()}>Close</div>
    </div>
  )
}

export default PictureModal