import React, { useState, useEffect } from 'react'

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

      </div>
    </div>
  )

}

export default CategoryWrapper