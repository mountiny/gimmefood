import React, { useState, useEffect } from 'react'

// Components
import Product from './Product.jsx'
import UnderlineText from './UnderlineText.jsx'

const CategoryWrapper = ({ category, showPictureModal, handleItemAdded, handleItemRemoved, children }) => {

  return (
    <div className="category-wrapper">
      <UnderlineText className='h-margin-bottom'>
        <h4 className="category-name h-offset-text h-700">{ category.name }</h4>
      </UnderlineText>
      <div className="products-container">

        {category.products.map((product, i) => {
          return (
            <Product
              key={`product-${product.id}`}
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