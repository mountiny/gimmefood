import React, { useState, useEffect, useRef } from 'react'
import useCounter from '../hooks/counterHook'
import { IMAGES } from '../config'

const Product = ({
    name, 
    price, 
    picture, 
    description_short,
    stock, 
    onPictureClick, 
    onItemAdded, 
    onItemRemoved
  }) => {

  const counter = useCounter(stock || 30)

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
      console.log("Price to be removed in Product:", price)
      onItemRemoved(price, name)
    }
  }

  return (
    <div className={`product-block h-block h-rounded 
      ${counter.value !== 0 ? 'h-selected' : ''}
      ${picture === '' ? 'product-no-image' : ''}
      `}>
      {(picture !== '') &&
        <div className="product-block__left h-pointer" onClick={() => onPictureClick()}>
          <img src={STATIC + picture} alt={name} className="product-img h-rounded"/>
        </div>
        }
      {/* <div className="product-block__left h-pointer" onClick={() => onPictureClick()}>
        <img src={STATIC + picture} alt={name} className="product-img h-rounded"/>
      </div> */}
       {/* onClick={() => handleFirstAddition()} */}
      <div className="product-block__middle" onClick={() => onPictureClick()}> 
        <span className="product-name h-700">{name}</span>
        <div className="product-desc">
          {/* {description_short} */}
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m
          </div>
      </div>
      <div 
        className={(counter.value === 0) ? "product-block__right h-rounded h-pointer"  : "product-block__right h-rounded" }
        onClick={() => handleFirstAddition()}>
        <div className="product-price">£{price}</div>
        <div className={counter.value === 0 ? "product-add" : "product-add h-display-none"}>ADD</div>
      
      </div>
      <div className="product-counter__line">
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
  )

}

export default Product