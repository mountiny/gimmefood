import React, { useState, useEffect, useRef } from 'react'
import useCounter from '../hooks/counterHook'
import { IMAGES } from '../config'

import Product from './Product.jsx'

const CategoryWrapper = ({ category, showPictureModal, handleItemAdded, handleItemRemoved, children }) => {

  return (
    <div className="category-wrapper">
      <h4 className="category-name">{ category.name }</h4>
      <div className="products-container">

        {category.products.map((product, i) => {
          return (
            <Product
              key={i}
              name={product.name}
              price={parseFloat(product.price/100).toFixed(2)}
              picture={product.image}
              description_short={product.description_short}
              stock={product.stock}
              onPictureClick={() => showPictureModal(product)}
              onItemAdded={(price, id) => handleItemAdded(price, id)}
              onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
            </Product>
          )
        })}

      {/* 
        <Product 
          name="Sourdough Bread" 
          price="3.00" 
          picture="logo.jpg" 
          description="This is a description of this lovely and crunchy bread."
          onPictureClick={(pic) => showPictureModal(pic)}
          onItemAdded={(price, id) => handleItemAdded(price, id)}
          onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
        </Product>
        <Product 
          name="Corn Bread" 
          price="2.49" 
          picture="logo.jpg" 
          description="Cornbread is underrated. Try ours."
          onPictureClick={(pic) => showPictureModal(pic)}
          onItemAdded={(price, id) => handleItemAdded(price, id)}
          onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
        </Product>
        <Product 
          name="Rye Bread" 
          price="2.29" 
          picture="logo.jpg" 
          description="Fiber fueled heatlhy bread."
          onPictureClick={(pic) => showPictureModal(pic)}
          onItemAdded={(price, id) => handleItemAdded(price, id)}
          onItemRemoved={(price, id) => handleItemRemoved(price,id)}>
        </Product> */}

      </div>
    </div>
  )

}

export default CategoryWrapper