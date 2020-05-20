import React, { useState, useEffect, useRef } from 'react'
import useCounter from '../hooks/counterHook'
import { IMAGES } from '../config'

const Product = ({
    product,
    inBasket,
    name,
    price, 
    picture, 
    description_short,
    stock,
    out_of_stock,
    onPictureClick, 
    onItemAdded, 
    onItemRemoved
  }) => {

  const counter = useCounter(stock, inBasket)

  const handleFirstAddition = () => {
    if (isOutOfStock()) return
    if (counter.value === 0 && counter.value < stock) {
      counter.increase()
      addItem()
    }
  }

  const addItem = () => {
    if (isOutOfStock()) return
    if (counter.value < stock) {
      onItemAdded(product)
    }
  }
  const removeItem = () => {
    if (isOutOfStock()) return
    if (counter.value !== 0) {
      onItemRemoved(product)
    }
  }

  const isOutOfStock = () => {
    return stock === 0
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
      {stock === 0 &&
        <div onClick={(e) => e.stopPropagation()} className='product-finished h-text-center h-700'>
          <div>
            {out_of_stock}
          </div>
        </div>
      }
    </div>
  )

}

export default Product