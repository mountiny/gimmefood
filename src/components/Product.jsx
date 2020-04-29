import React, { useState, useEffect, useRef } from 'react'
import useCounter from '../hooks/counterHook'
import { IMAGES } from '../config'

const Product = ({name, price, picture, description, max, onPictureClick, onItemAdded, onItemRemoved}) => {
  const counter = useCounter(max || 30)

  const handleFirstAddition = () => {
    if (counter.value === 0) {
      counter.increase()
      addItem()
    }
  }


  const addItem = () => {
    console.log("Price in Product:", price)
    onItemAdded(price, name)
  }
  const removeItem = () => {
    if (counter.value !== 0) {
      console.log("Price to be romved in Product:", price)
      onItemRemoved(price, name)
    }
  }

  return (
    <div className={counter.value !== 0 ? "product-block h-rounded h-selected" : "product-block h-rounded"}>
      <div className="product-block__left h-pointer" onClick={() => onPictureClick(picture)}>
        <img src={IMAGES + picture} alt="" className="product-img h-rounded"/>
      </div>
      <div className="product-block__middle" onClick={() => handleFirstAddition()}>
        <span className="product-name">{name}</span>
        <div className="product-desc">{description}</div>
      </div>
      <div 
        className={(counter.value === 0) ? "product-block__right h-rounded h-pointer"  : "product-block__right h-rounded" }
        onClick={() => handleFirstAddition()}>
        <div className="product-price">£{price}</div>
        <div className={(counter.value === 0) ? "product-counter unselected" : "product-counter"}>
          <div 
            className="product-minus product-counter__controls"
            onClick={() => {counter.decrease(); removeItem();}}>
            -
          </div>
          <div className="product-count">
            {counter.value}
          </div>
          <div 
            className="product-plus product-counter__controls"
            onClick={() => {counter.increase(); addItem();}}>
            +
          </div>
        </div>
      </div>
    </div>
  )

}

export default Product