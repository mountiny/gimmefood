import React, { useState, useEffect, useRef } from 'react'
import useLockBodyScroll from '../hooks/lockBodyScrollHook'
import { IMAGES } from '../config'

const PictureModal = ({picture, product, onClose}) => {

  useLockBodyScroll()

  console.log('Prodcut in modal: ', product)

  return (
    <div className="picture-modal modal">
      <div className="picture-modal__name-wrapper h-700">
        <div className="picture-modal__name-cont h-offset-bg">
          <h4 className='picture-modal__name'>{product.name}</h4>
        </div>
      </div>
      {(product.image !== '') && <img className="h-rounded" src={(product.image) ? STATIC + product.image : product} alt={product.name} />}
      <div className="picture-modal__description">
        <div className="picture-desctription__long">
          <b>Description:</b><br />
          {(product.description_long !== '') ? product.description_long : product.description_short}
        </div>
        <div className="picture-description__allergens h-700">
          {(product.allergens) && `A-${product.allergens.join("-")}`}
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