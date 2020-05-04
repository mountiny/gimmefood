import React, { useState, useEffect, useRef } from 'react'
import useLockBodyScroll from '../hooks/lockBodyScrollHook'
import { IMAGES } from '../config'

const PictureModal = ({picture, product, onClose}) => {

  useLockBodyScroll()

  return (
    <div className="picture-modal modal">
      <img className="h-rounded" src={IMAGES + picture} alt="Product image" />
      <div className="picture-modal__description">
        <div className="picture-desctription__long">
          {product.description}
        </div>
        <div className="picture-description__allergens h-700">
          A-{product.allergens.join("-")}
        </div>
      </div>
      <div 
        className="close-modal h-button h-pointer h-rounded" 
        onMouseUp={() => onClose()}>
          Close
      </div>
    </div>
  )
}

export default PictureModal